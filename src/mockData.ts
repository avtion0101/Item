
export interface Pet {
  id: number;
  name: string;
  type: '狗狗' | '猫咪' | '小兔';
  breed: string;
  age: string;
  image: string;
  description: string;
  tags: string[];
  owner_id?: string;
  contact?: string;
}

export const pets: Pet[] = [
  {
    id: 1,
    name: '贝拉 (Bella)',
    type: '狗狗',
    breed: '金毛寻回犬',
    age: '2 岁',
    image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=600&q=80',
    description: '贝拉是一只非常友好且精力充沛的金毛犬，最喜欢玩接球游戏。',
    tags: ['友好', '精力充沛', '亲近小孩']
  },
  {
    id: 2,
    name: '露娜 (Luna)',
    type: '猫咪',
    breed: '暹罗猫',
    age: '1 岁',
    image: 'https://images.unsplash.com/photo-1513245543132-31f507417b26?auto=format&fit=crop&w=600&q=80',
    description: '露娜是一只安静且粘人的暹罗猫，喜欢蜷缩在主人怀里。',
    tags: ['安静', '粘人', '室内型']
  },
  {
    id: 3,
    name: '查理 (Charlie)',
    type: '狗狗',
    breed: '比格犬',
    age: '3 岁',
    image: 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&w=600&q=80',
    description: '查理是一只充满好奇心的比格犬，热爱户外探险。',
    tags: ['好奇心强', '爱户外', '贪玩']
  },
  {
    id: 4,
    name: '米洛 (Milo)',
    type: '猫咪',
    breed: '虎斑猫',
    age: '6 个月',
    image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=600&q=80',
    description: '米洛是一只活泼的小猫，总是能给自己找到新鲜乐子。',
    tags: ['活泼', '幼猫', '好奇']
  },
  {
    id: 5,
    name: '黛西 (Daisy)',
    type: '小兔',
    breed: '荷兰垂耳兔',
    age: '1 岁',
    image: 'https://images.unsplash.com/photo-1585110396063-7eb2555776d3?auto=format&fit=crop&w=600&q=80',
    description: '黛西是一只温柔的兔子，喜欢吃胡萝卜和享受安静时光。',
    tags: ['温柔', '安静', '体型小']
  },
  {
    id: 6,
    name: '马克斯 (Max)',
    type: '狗狗',
    breed: '德国牧羊犬',
    age: '4 岁',
    image: 'https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?auto=format&fit=crop&w=600&q=80',
    description: '马克斯是一只忠诚且具有保护欲的伙伴，经过了良好的训练。',
    tags: ['忠诚', '保护欲', '训练有素']
  }
];
