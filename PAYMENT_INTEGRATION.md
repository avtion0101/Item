# 微信支付与支付宝接入指南 (Supabase Edge Functions)

为了实现真实的支付功能，您需要创建一个后端服务来与微信和支付宝的 API 进行交互。由于本项目使用 Supabase，最简单的方法是使用 **Supabase Edge Functions**。

## 1. 前置准备

### 微信支付 (WeChat Pay)
1.  注册 [微信支付商户号](https://pay.weixin.qq.com/)。
2.  获取 **AppID**, **MchID** (商户号), **API v3 Key**, **商户证书**。
3.  推荐使用 Node.js 库: `wechatpay-node-v3`。

### 支付宝 (Alipay)
1.  注册 [支付宝商家中心](https://b.alipay.com/)。
2.  创建应用并获取 **AppID**, **应用私钥**, **支付宝公钥**。
3.  推荐使用 Node.js 库: `alipay-sdk`。

---

## 2. 创建 Supabase Edge Function

在您的 Supabase 项目中创建一个名为 `create-payment` 的 Edge Function。

```bash
supabase functions new create-payment
```

### 代码示例 (`supabase/functions/create-payment/index.ts`)

```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
// 注意：Deno 环境下可能需要使用 npm specifiers 或 esm.sh 导入 SDK
// import AlipaySdk from 'npm:alipay-sdk';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { amount, method, description } = await req.json()

    // 1. 验证用户 (可选)
    // const authHeader = req.headers.get('Authorization')
    // ... verify JWT ...

    let payUrl = ''
    const orderId = `ORDER_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    if (method === 'wechat') {
      // --- 伪代码：调用微信统一下单 API (Native 模式) ---
      // const result = await wxPay.transactions_native({
      //   description: 'Pet Haven Donation',
      //   out_trade_no: orderId,
      //   amount: { total: amount * 100 }, // 分
      //   notify_url: 'https://your-project.functions.supabase.co/payment-webhook'
      // })
      // payUrl = result.code_url
      
      payUrl = `weixin://wxpay/bizpayurl?pr=${Math.random().toString(36)}` // 模拟
    } 
    else if (method === 'alipay') {
      // --- 伪代码：调用支付宝当面付 (Precreate) ---
      // const result = await alipaySdk.exec('alipay.trade.precreate', {
      //   bizContent: {
      //     out_trade_no: orderId,
      //     total_amount: amount,
      //     subject: 'Pet Haven Donation'
      //   },
      //   notifyUrl: 'https://your-project.functions.supabase.co/payment-webhook'
      // })
      // payUrl = result.qr_code
      
      payUrl = `https://qr.alipay.com/${Math.random().toString(36)}` // 模拟
    }

    // 2. 将订单信息存入数据库 (pending 状态)
    // await supabase.from('donations').insert({ ... })

    return new Response(
      JSON.stringify({ qrCode: payUrl, orderId }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
```

## 3. 前端集成 (DonationModal.tsx)

在前端，您需要修改 `handleDonate` 函数来调用这个 Edge Function。

```typescript
const handleDonate = async () => {
  setStep(2) // Loading
  try {
    const { data, error } = await supabase.functions.invoke('create-payment', {
      body: { amount, method: paymentMethod }
    })
    
    if (error) throw error
    
    setPaymentUrl(data.qrCode) // 设置二维码内容
    setStep(3) // 显示二维码
    
    // 开始轮询检查支付状态...
  } catch (err) {
    alert('创建订单失败')
    setStep(1)
  }
}
```

## 4. 处理回调 (Webhook)

您还需要创建另一个 Function (如 `payment-webhook`) 来接收微信/支付宝的异步通知，验证签名，并将数据库中的订单状态更新为 `success`。
