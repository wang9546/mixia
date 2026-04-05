const mockData = {
  banners: [
    {
      _id: '1',
      title: '婚礼策划',
      image: 'https://img.zcool.cn/community/01e8d95e3a6f95a801213f26c19c18.jpg@1280w_1l_2o_100sh.jpg',
      link: '/pages/decor/list',
      sort: 1,
      status: 1
    },
    {
      _id: '2',
      title: '婚纱礼服',
      image: 'https://img.zcool.cn/community/016c7a5e3a6f95a801213f269fb7c3.jpg@1280w_1l_2o_100sh.jpg',
      link: '/pages/dress/list',
      sort: 2,
      status: 1
    },
    {
      _id: '3',
      title: '婚车租赁',
      image: 'https://img.zcool.cn/community/015c7a5e3a6f95a801213f269fb7c3.jpg@1280w_1l_2o_100sh.jpg',
      link: '/pages/car/list',
      sort: 3,
      status: 1
    }
  ],

  weddingCars: [
    {
      _id: '1',
      title: '奔驰S级',
      coverImage: 'https://img.zcool.cn/community/01e8d95e3a6f95a801213f26c19c18.jpg@1280w_1l_2o_100sh.jpg',
      brand: 'benz',
      color: 'black',
      viewCount: 1234,
      status: 1,
      createTime: new Date('2024-01-01')
    },
    {
      _id: '2',
      title: '宝马7系',
      coverImage: 'https://img.zcool.cn/community/016c7a5e3a6f95a801213f269fb7c3.jpg@1280w_1l_2o_100sh.jpg',
      brand: 'bmw',
      color: 'white',
      viewCount: 2345,
      status: 1,
      createTime: new Date('2024-01-02')
    }
  ],

  weddingDresses: [
    {
      _id: '1',
      title: '梦幻公主型婚纱',
      coverImage: 'https://img.zcool.cn/community/01e8d95e3a6f95a801213f26c19c18.jpg@1280w_1l_2o_100sh.jpg',
      style: 'princess',
      description: '经典公主型剪裁，层层叠叠的薄纱裙摆，打造梦幻童话般的婚礼造型',
      material: '进口蕾丝、法国薄纱',
      size: 'S/M/L/XL/XXL',
      color: '象牙白、香槟金',
      viewCount: 1234,
      collectCount: 89,
      status: 1,
      images: [
        'https://img.zcool.cn/community/01e8d95e3a6f95a801213f26c19c18.jpg@1280w_1l_2o_100sh.jpg',
        'https://img.zcool.cn/community/016c7a5e3a6f95a801213f269fb7c3.jpg@1280w_1l_2o_100sh.jpg'
      ],
      createTime: new Date('2024-01-01')
    },
    {
      _id: '2',
      title: '优雅鱼尾型婚纱',
      coverImage: 'https://img.zcool.cn/community/016c7a5e3a6f95a801213f269fb7c3.jpg@1280w_1l_2o_100sh.jpg',
      style: 'mermaid',
      description: '修身鱼尾设计，完美展现身材曲线，优雅大气的选择',
      material: '缎面、蕾丝',
      size: 'S/M/L/XL',
      color: '纯白、象牙白',
      viewCount: 2345,
      collectCount: 156,
      status: 1,
      images: [
        'https://img.zcool.cn/community/016c7a5e3a6f95a801213f269fb7c3.jpg@1280w_1l_2o_100sh.jpg'
      ],
      createTime: new Date('2024-01-02')
    },
    {
      _id: '3',
      title: '浪漫A字型婚纱',
      coverImage: 'https://img.zcool.cn/community/015c7a5e3a6f95a801213f269fb7c3.jpg@1280w_1l_2o_100sh.jpg',
      style: 'a-line',
      description: '经典A字型剪裁，适合各种身材，简约而不简单',
      material: '雪纺、蕾丝',
      size: 'S/M/L/XL/XXL',
      color: '象牙白',
      viewCount: 1876,
      collectCount: 123,
      status: 1,
      images: [
        'https://img.zcool.cn/community/015c7a5e3a6f95a801213f269fb7c3.jpg@1280w_1l_2o_100sh.jpg'
      ],
      createTime: new Date('2024-01-03')
    },
    {
      _id: '4',
      title: '高贵拖尾婚纱',
      coverImage: 'https://img.zcool.cn/community/01e8d95e3a6f95a801213f26c19c18.jpg@1280w_1l_2o_100sh.jpg',
      style: 'princess',
      description: '超长拖尾设计，奢华大气的教堂婚礼首选',
      material: '进口缎面、手工刺绣',
      size: 'M/L/XL',
      color: '象牙白、珍珠白',
      viewCount: 3456,
      collectCount: 201,
      status: 1,
      images: [
        'https://img.zcool.cn/community/01e8d95e3a6f95a801213f26c19c18.jpg@1280w_1l_2o_100sh.jpg'
      ],
      createTime: new Date('2024-01-04')
    },
    {
      _id: '5',
      title: '简约修身婚纱',
      coverImage: 'https://img.zcool.cn/community/016c7a5e3a6f95a801213f269fb7c3.jpg@1280w_1l_2o_100sh.jpg',
      style: 'mermaid',
      description: '极简主义设计，干净利落的线条，现代感十足',
      material: '缎面',
      size: 'S/M/L/XL',
      color: '纯白',
      viewCount: 1567,
      collectCount: 98,
      status: 1,
      images: [
        'https://img.zcool.cn/community/016c7a5e3a6f95a801213f269fb7c3.jpg@1280w_1l_2o_100sh.jpg'
      ],
      createTime: new Date('2024-01-05')
    },
    {
      _id: '6',
      title: '复古宫廷婚纱',
      coverImage: 'https://img.zcool.cn/community/015c7a5e3a6f95a801213f269fb7c3.jpg@1280w_1l_2o_100sh.jpg',
      style: 'a-line',
      description: '复古宫廷风格，精致的手工刺绣，尽显高贵典雅',
      material: '进口蕾丝、珍珠装饰',
      size: 'M/L/XL',
      color: '象牙白、香槟金',
      viewCount: 2890,
      collectCount: 178,
      status: 1,
      images: [
        'https://img.zcool.cn/community/015c7a5e3a6f95a801213f269fb7c3.jpg@1280w_1l_2o_100sh.jpg'
      ],
      createTime: new Date('2024-01-06')
    }
  ],

  venueDecorations: [
    {
      _id: '1',
      title: '浪漫花园主题布置',
      coverImage: 'https://img.zcool.cn/community/01e8d95e3a6f95a801213f26c19c18.jpg@1280w_1l_2o_100sh.jpg',
      style: 'garden',
      description: '鲜花绿植环绕，梦幻花园氛围，适合户外草坪婚礼',
      features: ['鲜花拱门', '绿植装饰', '花道路引', '桌花布置'],
      suitableVenue: '户外草坪、花园',
      viewCount: 1234,
      collectCount: 89,
      status: 1,
      images: [
        'https://img.zcool.cn/community/01e8d95e3a6f95a801213f26c19c18.jpg@1280w_1l_2o_100sh.jpg',
        'https://img.zcool.cn/community/016c7a5e3a6f95a801213f269fb7c3.jpg@1280w_1l_2o_100sh.jpg'
      ],
      createTime: new Date('2024-01-01')
    },
    {
      _id: '2',
      title: '海洋主题布置',
      coverImage: 'https://img.zcool.cn/community/016c7a5e3a6f95a801213f269fb7c3.jpg@1280w_1l_2o_100sh.jpg',
      style: 'ocean',
      description: '蓝色海洋元素，清新浪漫，适合海边或泳池婚礼',
      features: ['海洋元素装饰', '蓝色系配色', '贝壳珍珠点缀', '波浪造型'],
      suitableVenue: '海边、泳池、室内宴会厅',
      viewCount: 2345,
      collectCount: 156,
      status: 1,
      images: [
        'https://img.zcool.cn/community/016c7a5e3a6f95a801213f269fb7c3.jpg@1280w_1l_2o_100sh.jpg'
      ],
      createTime: new Date('2024-01-02')
    },
    {
      _id: '3',
      title: '经典教堂婚礼布置',
      coverImage: 'https://img.zcool.cn/community/015c7a5e3a6f95a801213f269fb7c3.jpg@1280w_1l_2o_100sh.jpg',
      style: 'classic',
      description: '庄重典雅的教堂风格，神圣浪漫的婚礼氛围',
      features: ['鲜花路引', '蜡烛装饰', '白色系配色', '十字架装饰'],
      suitableVenue: '教堂、礼堂',
      viewCount: 1876,
      collectCount: 123,
      status: 1,
      images: [
        'https://img.zcool.cn/community/015c7a5e3a6f95a801213f269fb7c3.jpg@1280w_1l_2o_100sh.jpg'
      ],
      createTime: new Date('2024-01-03')
    },
    {
      _id: '4',
      title: '中式传统婚礼布置',
      coverImage: 'https://img.zcool.cn/community/01e8d95e3a6f95a801213f26c19c18.jpg@1280w_1l_2o_100sh.jpg',
      style: 'chinese',
      description: '传统中式元素，喜庆吉祥的氛围，适合中式婚礼',
      features: ['红色系配色', '中国结装饰', '灯笼布置', '喜字装饰'],
      suitableVenue: '酒店宴会厅、中式庭院',
      viewCount: 3456,
      collectCount: 201,
      status: 1,
      images: [
        'https://img.zcool.cn/community/01e8d95e3a6f95a801213f26c19c18.jpg@1280w_1l_2o_100sh.jpg'
      ],
      createTime: new Date('2024-01-04')
    },
    {
      _id: '5',
      title: '森系自然布置',
      coverImage: 'https://img.zcool.cn/community/016c7a5e3a6f95a801213f269fb7c3.jpg@1280w_1l_2o_100sh.jpg',
      style: 'forest',
      description: '原木绿植搭配，自然清新风格，适合森系婚礼',
      features: ['原木装饰', '绿植墙', '藤蔓装饰', '木质路引'],
      suitableVenue: '森林、户外、木屋',
      viewCount: 1567,
      collectCount: 98,
      status: 1,
      images: [
        'https://img.zcool.cn/community/016c7a5e3a6f95a801213f269fb7c3.jpg@1280w_1l_2o_100sh.jpg'
      ],
      createTime: new Date('2024-01-05')
    },
    {
      _id: '6',
      title: '奢华水晶婚礼布置',
      coverImage: 'https://img.zcool.cn/community/015c7a5e3a6f95a801213f269fb7c3.jpg@1280w_1l_2o_100sh.jpg',
      style: 'luxury',
      description: '璀璨水晶装饰，奢华大气的风格，适合高端婚礼',
      features: ['水晶吊灯', '水晶路引', '珠帘装饰', '金色点缀'],
      suitableVenue: '酒店宴会厅、城堡',
      viewCount: 2890,
      collectCount: 178,
      status: 1,
      images: [
        'https://img.zcool.cn/community/015c7a5e3a6f95a801213f269fb7c3.jpg@1280w_1l_2o_100sh.jpg'
      ],
      createTime: new Date('2024-01-06')
    }
  ],

  vipStaff: [
    {
      _id: '1',
      name: '张司仪',
      type: 'emcee',
      title: '资深婚礼司仪',
      avatar: 'https://img.zcool.cn/community/01e8d95e3a6f95a801213f26c19c18.jpg@1280w_1l_2o_100sh.jpg',
      experience: '10年',
      styles: ['classic', 'romantic'],
      introduction: '从业10年，主持过500+场婚礼',
      status: 'active',
      sort: 100,
      createTime: new Date('2024-01-01')
    },
    {
      _id: '2',
      name: '李化妆师',
      type: 'makeup',
      title: '高级化妆师',
      avatar: 'https://img.zcool.cn/community/016c7a5e3a6f95a801213f269fb7c3.jpg@1280w_1l_2o_100sh.jpg',
      experience: '8年',
      styles: ['korean', 'chinese'],
      introduction: '擅长韩式、中式新娘造型',
      status: 'active',
      sort: 90,
      createTime: new Date('2024-01-02')
    },
    {
      _id: '3',
      name: '王摄影师',
      type: 'photographer',
      title: '首席摄影师',
      avatar: 'https://img.zcool.cn/community/015c7a5e3a6f95a801213f269fb7c3.jpg@1280w_1l_2o_100sh.jpg',
      experience: '12年',
      styles: ['documentary', 'artistic'],
      introduction: '纪实风格，捕捉真实瞬间',
      status: 'active',
      sort: 95,
      createTime: new Date('2024-01-03')
    }
  ],

  vipBookings: [
    {
      _id: '1',
      bookingNo: 'VIP20240101001',
      staffId: '1',
      staffName: '张司仪',
      staffType: 'emcee',
      weddingDate: '2024-06-01',
      weddingLocation: '北京朝阳区XX酒店',
      userName: '张先生',
      userPhone: '138****1234',
      status: 'pending',
      createTime: new Date('2024-01-01')
    },
    {
      _id: '2',
      bookingNo: 'VIP20240102001',
      staffId: '2',
      staffName: '李化妆师',
      staffType: 'makeup',
      weddingDate: '2024-06-15',
      weddingLocation: '北京海淀区XX酒店',
      userName: '李女士',
      userPhone: '139****5678',
      status: 'confirmed',
      createTime: new Date('2024-01-02')
    }
  ],

  user: {
    _id: 'user001',
    nickName: '测试用户',
    avatarUrl: 'https://img.zcool.cn/community/01e8d95e3a6f95a801213f26c19c18.jpg@1280w_1l_2o_100sh.jpg',
    phone: '138****1234',
    gender: 1,
    isAdmin: true,
    status: 1,
    createTime: new Date('2024-01-01')
  },

  staffTypes: [
    { id: 'emcee', name: '司仪', sort: 1 },
    { id: 'makeup', name: '化妆师', sort: 2 },
    { id: 'photographer', name: '摄影师', sort: 3 },
    { id: 'videographer', name: '摄像师', sort: 4 }
  ],

  scheduleData: {
    '2024-01-15': {
      '1': {
        tasks: [
          {
            id: 'task_1_1',
            title: '婚礼主持',
            remark: '朝阳区XX酒店',
            startHour: 9,
            endHour: 12,
            status: 'booked'
          },
          {
            id: 'task_1_2',
            title: '会议',
            remark: '公司会议',
            startHour: 14,
            endHour: 16,
            status: 'unavailable'
          }
        ]
      },
      '2': {
        tasks: [
          {
            id: 'task_2_1',
            title: '新娘化妆',
            remark: '海淀区XX酒店',
            startHour: 8,
            endHour: 11,
            status: 'booked'
          }
        ]
      },
      '3': {
        tasks: [
          {
            id: 'task_3_1',
            title: '婚纱拍摄',
            remark: '朝阳区XX酒店',
            startHour: 10,
            endHour: 14,
            status: 'booked'
          },
          {
            id: 'task_3_2',
            title: '个人写真',
            remark: '工作室',
            startHour: 16,
            endHour: 18,
            status: 'booked'
          }
        ]
      }
    },
    '2026-03-02': {
      '1': {
        tasks: [
          {
            id: 'task_1_0302_1',
            title: '婚礼主持',
            remark: '朝阳区国贸大酒店',
            startHour: 10,
            endHour: 13,
            status: 'booked'
          }
        ]
      },
      '2': {
        tasks: [
          {
            id: 'task_2_0302_1',
            title: '新娘化妆',
            remark: '海淀区五棵松酒店',
            startHour: 7,
            endHour: 10,
            status: 'booked'
          },
          {
            id: 'task_2_0302_2',
            title: '晚宴化妆',
            remark: '朝阳区望京酒店',
            startHour: 17,
            endHour: 19,
            status: 'booked'
          }
        ]
      }
    },
    '2026-03-03': {
      '1': {
        tasks: [
          {
            id: 'task_1_0303_1',
            title: '婚礼主持',
            remark: '西城区金融街酒店',
            startHour: 11,
            endHour: 14,
            status: 'booked'
          }
        ]
      },
      '3': {
        tasks: [
          {
            id: 'task_3_0303_1',
            title: '婚纱摄影',
            remark: '朝阳区蓝色港湾',
            startHour: 9,
            endHour: 12,
            status: 'booked'
          },
          {
            id: 'task_3_0303_2',
            title: '婚礼跟拍',
            remark: '西城区金融街酒店',
            startHour: 14,
            endHour: 18,
            status: 'booked'
          }
        ]
      }
    },
    '2026-03-05': {
      '1': {
        tasks: [
          {
            id: 'task_1_0305_1',
            title: '婚礼主持',
            remark: '东城区王府井酒店',
            startHour: 9,
            endHour: 12,
            status: 'booked'
          },
          {
            id: 'task_1_0305_2',
            title: '培训',
            remark: '公司培训',
            startHour: 15,
            endHour: 17,
            status: 'unavailable'
          }
        ]
      },
      '2': {
        tasks: [
          {
            id: 'task_2_0305_1',
            title: '新娘化妆',
            remark: '朝阳区三里屯酒店',
            startHour: 8,
            endHour: 11,
            status: 'booked'
          }
        ]
      },
      '4': {
        tasks: [
          {
            id: 'task_4_0305_1',
            title: '婚礼摄像',
            remark: '东城区王府井酒店',
            startHour: 8,
            endHour: 13,
            status: 'booked'
          }
        ]
      }
    },
    '2026-03-08': {
      '1': {
        tasks: [
          {
            id: 'task_1_0308_1',
            title: '婚礼主持',
            remark: '海淀区中关村酒店',
            startHour: 10,
            endHour: 13,
            status: 'booked'
          }
        ]
      },
      '2': {
        tasks: [
          {
            id: 'task_2_0308_1',
            title: '新娘化妆',
            remark: '朝阳区CBD酒店',
            startHour: 6,
            endHour: 9,
            status: 'booked'
          },
          {
            id: 'task_2_0308_2',
            title: '晚宴化妆',
            remark: '海淀区中关村酒店',
            startHour: 16,
            endHour: 18,
            status: 'booked'
          }
        ]
      },
      '3': {
        tasks: [
          {
            id: 'task_3_0308_1',
            title: '婚纱摄影',
            remark: '朝阳区奥林匹克公园',
            startHour: 8,
            endHour: 12,
            status: 'booked'
          }
        ]
      },
      '4': {
        tasks: [
          {
            id: 'task_4_0308_1',
            title: '婚礼摄像',
            remark: '海淀区中关村酒店',
            startHour: 9,
            endHour: 14,
            status: 'booked'
          }
        ]
      }
    },
    '2026-03-10': {
      '1': {
        tasks: [
          {
            id: 'task_1_0310_1',
            title: '婚礼主持',
            remark: '朝阳区望京酒店',
            startHour: 11,
            endHour: 14,
            status: 'booked'
          }
        ]
      },
      '3': {
        tasks: [
          {
            id: 'task_3_0310_1',
            title: '婚纱摄影',
            remark: '朝阳区798艺术区',
            startHour: 10,
            endHour: 14,
            status: 'booked'
          }
        ]
      }
    },
    '2026-03-15': {
      '1': {
        tasks: [
          {
            id: 'task_1_0315_1',
            title: '婚礼主持',
            remark: '朝阳区国贸大酒店',
            startHour: 9,
            endHour: 12,
            status: 'booked'
          },
          {
            id: 'task_1_0315_2',
            title: '婚礼主持',
            remark: '海淀区五道口酒店',
            startHour: 15,
            endHour: 18,
            status: 'booked'
          }
        ]
      },
      '2': {
        tasks: [
          {
            id: 'task_2_0315_1',
            title: '新娘化妆',
            remark: '朝阳区国贸大酒店',
            startHour: 6,
            endHour: 9,
            status: 'booked'
          },
          {
            id: 'task_2_0315_2',
            title: '新娘化妆',
            remark: '海淀区五道口酒店',
            startHour: 13,
            endHour: 16,
            status: 'booked'
          }
        ]
      },
      '3': {
        tasks: [
          {
            id: 'task_3_0315_1',
            title: '婚纱摄影',
            remark: '朝阳区国贸大酒店',
            startHour: 8,
            endHour: 12,
            status: 'booked'
          }
        ]
      },
      '4': {
        tasks: [
          {
            id: 'task_4_0315_1',
            title: '婚礼摄像',
            remark: '朝阳区国贸大酒店',
            startHour: 8,
            endHour: 13,
            status: 'booked'
          },
          {
            id: 'task_4_0315_2',
            title: '婚礼摄像',
            remark: '海淀区五道口酒店',
            startHour: 14,
            endHour: 19,
            status: 'booked'
          }
        ]
      }
    }
  },

  styles: [
    { id: 'classic', name: '经典', sort: 1, status: 1 },
    { id: 'romantic', name: '浪漫', sort: 2, status: 1 },
    { id: 'garden', name: '花园', sort: 3, status: 1 },
    { id: 'korean', name: '韩式', sort: 4, status: 1 },
    { id: 'chinese', name: '中式', sort: 5, status: 1 }
  ],

  carBrands: [
    { _id: 'brand_1', name: '奔驰', logo: '', sort: 1, status: 1, createTime: new Date('2024-01-01') },
    { _id: 'brand_2', name: '宝马', logo: '', sort: 2, status: 1, createTime: new Date('2024-01-02') },
    { _id: 'brand_3', name: '奥迪', logo: '', sort: 3, status: 1, createTime: new Date('2024-01-03') },
    { _id: 'brand_4', name: '保时捷', logo: '', sort: 4, status: 1, createTime: new Date('2024-01-04') },
    { _id: 'brand_5', name: '劳斯莱斯', logo: '', sort: 5, status: 1, createTime: new Date('2024-01-05') }
  ],

  carColors: [
    { _id: 'color_1', name: '黑色', colorValue: '#000000', sort: 1, status: 1, createTime: new Date('2024-01-01') },
    { _id: 'color_2', name: '白色', colorValue: '#FFFFFF', sort: 2, status: 1, createTime: new Date('2024-01-02') },
    { _id: 'color_3', name: '红色', colorValue: '#FF0000', sort: 3, status: 1, createTime: new Date('2024-01-03') },
    { _id: 'color_4', name: '银色', colorValue: '#C0C0C0', sort: 4, status: 1, createTime: new Date('2024-01-04') },
    { _id: 'color_5', name: '香槟金', colorValue: '#F7E7CE', sort: 5, status: 1, createTime: new Date('2024-01-05') }
  ],

  weddingCars: [
    {
      _id: 'car_1',
      brandId: 'brand_1',
      colorId: 'color_1',
      name: '奔驰S级',
      images: [
        'https://img.zcool.cn/community/01e8d95e3a6f95a801213f26c19c18.jpg@1280w_1l_2o_100sh.jpg',
        'https://img.zcool.cn/community/016c7a5e3a6f95a801213f269fb7c3.jpg@1280w_1l_2o_100sh.jpg'
      ],
      coverImage: 'https://img.zcool.cn/community/01e8d95e3a6f95a801213f26c19c18.jpg@1280w_1l_2o_100sh.jpg',
      price: 1500,
      priceUnit: '天',
      remark: '豪华商务轿车，适合作为主婚车',
      sort: 1,
      status: 1,
      createTime: new Date('2024-01-01'),
      updateTime: new Date('2024-01-01')
    },
    {
      _id: 'car_2',
      brandId: 'brand_2',
      colorId: 'color_2',
      name: '宝马7系',
      images: [
        'https://img.zcool.cn/community/016c7a5e3a6f95a801213f269fb7c3.jpg@1280w_1l_2o_100sh.jpg'
      ],
      coverImage: 'https://img.zcool.cn/community/016c7a5e3a6f95a801213f269fb7c3.jpg@1280w_1l_2o_100sh.jpg',
      price: 1800,
      priceUnit: '天',
      remark: '德系豪华轿车，外观大气',
      sort: 2,
      status: 1,
      createTime: new Date('2024-01-02'),
      updateTime: new Date('2024-01-02')
    },
    {
      _id: 'car_3',
      brandId: 'brand_3',
      colorId: 'color_1',
      name: '奥迪A8L',
      images: [
        'https://img.zcool.cn/community/015c7a5e3a6f95a801213f269fb7c3.jpg@1280w_1l_2o_100sh.jpg'
      ],
      coverImage: 'https://img.zcool.cn/community/015c7a5e3a6f95a801213f269fb7c3.jpg@1280w_1l_2o_100sh.jpg',
      price: 1600,
      priceUnit: '天',
      remark: '商务豪华轿车，性价比高',
      sort: 3,
      status: 1,
      createTime: new Date('2024-01-03'),
      updateTime: new Date('2024-01-03')
    },
    {
      _id: 'car_4',
      brandId: 'brand_4',
      colorId: 'color_2',
      name: '保时捷帕拉梅拉',
      images: [
        'https://img.zcool.cn/community/01e8d95e3a6f95a801213f26c19c18.jpg@1280w_1l_2o_100sh.jpg'
      ],
      coverImage: 'https://img.zcool.cn/community/01e8d95e3a6f95a801213f26c19c18.jpg@1280w_1l_2o_100sh.jpg',
      price: 2500,
      priceUnit: '天',
      remark: '运动豪华轿车，时尚动感',
      sort: 4,
      status: 1,
      createTime: new Date('2024-01-04'),
      updateTime: new Date('2024-01-04')
    },
    {
      _id: 'car_5',
      brandId: 'brand_5',
      colorId: 'color_1',
      name: '劳斯莱斯幻影',
      images: [
        'https://img.zcool.cn/community/016c7a5e3a6f95a801213f269fb7c3.jpg@1280w_1l_2o_100sh.jpg'
      ],
      coverImage: 'https://img.zcool.cn/community/016c7a5e3a6f95a801213f269fb7c3.jpg@1280w_1l_2o_100sh.jpg',
      price: 8000,
      priceUnit: '天',
      remark: '顶级奢华轿车，尊贵首选',
      sort: 5,
      status: 1,
      createTime: new Date('2024-01-05'),
      updateTime: new Date('2024-01-05')
    },
    {
      _id: 'car_6',
      brandId: 'brand_1',
      colorId: 'color_3',
      name: '奔驰E级',
      images: [
        'https://img.zcool.cn/community/015c7a5e3a6f95a801213f269fb7c3.jpg@1280w_1l_2o_100sh.jpg'
      ],
      coverImage: 'https://img.zcool.cn/community/015c7a5e3a6f95a801213f269fb7c3.jpg@1280w_1l_2o_100sh.jpg',
      price: 1000,
      priceUnit: '天',
      remark: '中高端商务轿车，适合作为副车',
      sort: 6,
      status: 1,
      createTime: new Date('2024-01-06'),
      updateTime: new Date('2024-01-06')
    }
  ],

  dressStyles: [
    { id: 'princess', name: '公主型', sort: 1, status: 1 },
    { id: 'mermaid', name: '鱼尾型', sort: 2, status: 1 },
    { id: 'a-line', name: 'A字型', sort: 3, status: 1 }
  ],

  decorStyles: [
    { id: 'garden', name: '花园', sort: 1, status: 1 },
    { id: 'ocean', name: '海洋', sort: 2, status: 1 },
    { id: 'classic', name: '经典', sort: 3, status: 1 }
  ]
};

function delay(ms = 300) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = {
  async getUserInfo() {
    await delay();
    return mockData.user;
  },

  async checkAdmin() {
    await delay();
    return mockData.user.isAdmin;
  },

  async updateUser(data) {
    await delay();
    Object.assign(mockData.user, data, { updateTime: new Date() });
    return { code: 200, message: '更新成功' };
  },

  async getBannerList(status) {
    await delay();
    let banners = mockData.banners;
    if (status !== undefined) {
      banners = banners.filter(b => b.status === status);
    }
    return banners;
  },

  async getRecommendCases(limit = 6) {
    await delay();
    return mockData.venueDecorations.slice(0, limit);
  },

  async incrementView(collectionName, id) {
    await delay(100);
    console.log(`Increment view for ${collectionName}.${id}`);
  },

  async getServiceList(serviceType, params = {}) {
    await delay();
    let list = [];
    const { page = 1, pageSize = 10 } = params;
    
    switch (serviceType) {
      case 'wedding_car':
        list = mockData.weddingCars;
        break;
      case 'wedding_dress':
        list = mockData.weddingDresses;
        break;
      case 'venue_decor':
        list = mockData.venueDecorations;
        break;
    }
    
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    return {
      list: list.slice(start, end),
      total: list.length,
      page,
      pageSize
    };
  },

  async getServiceDetail(serviceType, id) {
    await delay();
    let list = [];
    switch (serviceType) {
      case 'wedding_car':
        list = mockData.weddingCars;
        break;
      case 'wedding_dress':
        list = mockData.weddingDresses;
        break;
      case 'venue_decor':
        list = mockData.venueDecorations;
        break;
    }
    const item = list.find(i => i._id === id);
    if (!item) {
      throw new Error('内容不存在');
    }
    return item;
  },

  async getServiceConfigs(serviceType) {
    await delay();
    const configs = {};
    switch (serviceType) {
      case 'wedding_car':
        configs.brands = mockData.carBrands;
        configs.colors = mockData.carColors;
        break;
      case 'wedding_dress':
        configs.styles = mockData.dressStyles;
        break;
      case 'venue_decor':
        configs.styles = mockData.decorStyles;
        break;
    }
    return configs;
  },

  async getVipStaffTypes() {
    await delay();
    return mockData.staffTypes;
  },

  async getVipStyles() {
    await delay();
    return mockData.styles;
  },

  async getVipStaffList(params = {}) {
    await delay();
    const { page = 1, pageSize = 10, type } = params;
    let list = mockData.vipStaff.filter(s => s.status === 'active');
    if (type) {
      list = list.filter(s => s.type === type);
    }
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    return {
      list: list.slice(start, end),
      total: list.length,
      page,
      pageSize
    };
  },

  async getVipStaffDetail(id) {
    await delay();
    const staff = mockData.vipStaff.find(s => s._id === id);
    if (!staff) {
      throw new Error('服务人员不存在');
    }
    staff.works = [];
    return staff;
  },

  async getMyVipBookings(params = {}) {
    await delay();
    const { page = 1, pageSize = 10, status } = params;
    let list = mockData.vipBookings;
    if (status) {
      list = list.filter(b => b.status === status);
    }
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    return {
      list: list.slice(start, end),
      total: list.length,
      page,
      pageSize
    };
  },

  async getVipBookingDetail(id) {
    await delay();
    const booking = mockData.vipBookings.find(b => b._id === id);
    if (!booking) {
      throw new Error('预约不存在');
    }
    return booking;
  },

  async getFavoriteList(params = {}) {
    await delay();
    return { list: [], total: 0 };
  },

  async checkFavorite(caseId) {
    await delay(100);
    return false;
  },

  async getBookingList(params = {}) {
    await delay();
    return { list: [], total: 0 };
  },

  async getBookingDetail(id) {
    await delay();
    throw new Error('预约不存在');
  },

  async getAdminStaffList(params = {}) {
    await delay();
    const { page = 1, pageSize = 20, type, status } = params;
    let list = mockData.vipStaff;
    if (type) {
      list = list.filter(s => s.type === type);
    }
    if (status) {
      list = list.filter(s => s.status === status);
    }
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    return {
      list: list.slice(start, end),
      total: list.length,
      page,
      pageSize
    };
  },

  async getAdminBookingList(params = {}) {
    await delay();
    const { page = 1, pageSize = 20, status } = params;
    let list = mockData.vipBookings;
    if (status) {
      list = list.filter(b => b.status === status);
    }
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    return {
      list: list.slice(start, end),
      total: list.length,
      page,
      pageSize
    };
  },

  async getAdminBookingStats() {
    await delay();
    return {
      pending: 5,
      confirmed: 10,
      todayTotal: 2,
      thisMonthTotal: 15
    };
  },

  async getAdminScheduleByDate(params = {}) {
    await delay();
    const { date, type } = params;
    let staffList = mockData.vipStaff.filter(s => s.status === 'active');
    if (type) {
      staffList = staffList.filter(s => s.type === type);
    }
    
    const dateSchedule = mockData.scheduleData[date] || {};
    
    return staffList.map(staff => {
      const staffSchedule = dateSchedule[staff._id] || { tasks: [] };
      return {
        ...staff,
        tasks: staffSchedule.tasks || []
      };
    });
  },

  async getStore() {
    await delay();
    return {
      name: '米夏婚礼',
      address: '北京市朝阳区XX路XX号',
      phone: '400-123-4567',
      introduction: '专业婚礼策划服务',
      images: []
    };
  }
};
