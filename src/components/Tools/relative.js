// {
//     name: "",
//     words: [
//         {
//             word: "",
//             id: null
//         }
//     ],
//     relative: {
//         fa: null,
//         mu: null,
//         xiong: null,
//         di: null,
//         jie: null,
//         mei: null,
//         fu: null,
//         qi: null,
//         zi: null,
//         nv: null
//     }
// },
export const buttons = [
  {
    name: '父',
    filed: 'fa'
  },
  {
    name: '母',
    filed: 'mu'
  },
  {
    name: '兄',
    filed: 'xiong'
  },
  {
    name: '弟',
    filed: 'di'
  },
  {
    name: '姐',
    filed: 'jie'
  },
  {
    name: '妹',
    filed: 'mei'
  },
  {
    name: '夫',
    filed: 'fu'
  },
  {
    name: '妻',
    filed: 'qi'
  },
  {
    name: '子',
    filed: 'zi'
  },
  {
    name: '女',
    filed: 'nv'
  }
]
export const fieldName = {
  fa: '父亲',
  mu: '母亲',
  xiong: '兄亲',
  di: '弟亲',
  jie: '姊亲',
  mei: '妹亲',
  fu: '夫亲',
  qi: '妻亲',
  zi: '男亲',
  nv: '女亲'
}
export const relative = [
  {
    name: '己身',
    words: [
      {
        word: '家己',
        id: 1966
      }
    ],
    relations: {
      fa: '父亲',
      mu: '母亲',
      xiong: '兄亲',
      di: '弟亲',
      jie: '姊亲',
      mei: '妹亲',
      fu: '夫亲',
      qi: '妻亲',
      zi: '男亲',
      nv: '女亲'
    }
  },
  {
    name: '祖先',
    words: [
      {
        word: '祖公',
        id: 5767
      }
    ]
  },
  {
    name: '高祖父',
    words: [
      {
        word: '四代公',
        id: 4640
      }
    ],
    relations: {
      fa: null,
      mu: null,
      xiong: null,
      di: null,
      jie: null,
      mei: null,
      fu: null,
      qi: '高祖母',
      zi: '曾祖父',
      nv: null
    }
  },
  {
    name: '高祖母',
    words: [
      {
        word: '四代妈',
        id: 4641
      }
    ],
    relations: {
      fa: null,
      mu: null,
      xiong: null,
      di: null,
      jie: null,
      mei: null,
      fu: '高祖父',
      qi: null,
      zi: '曾祖父',
      nv: null
    }
  },
  {
    name: '曾祖父',
    words: [
      {
        word: '大公',
        id: 1740
      }
    ],
    relations: {
      fa: '高祖父',
      mu: '高祖母',
      xiong: null,
      di: null,
      jie: null,
      mei: null,
      fu: null,
      qi: '曾祖母',
      zi: ['祖父','伯祖父','叔祖父'],
      nv: ['姑祖母']
    }
  },
  {
    name: '曾祖母',
    words: [
      {
        word: '大妈',
        id: 1762
      }
    ],
    relations: {
      fa: null,
      mu: null,
      xiong: null,
      di: null,
      jie: null,
      mei: null,
      fu: '曾祖父',
      qi: null,
      zi: ['祖父','伯祖父','叔祖父'],
      nv: ['姑祖母']
    }
  },
  {
    name: '外曾祖父',
    words: [
      {
        word: '大公',
        id: 1740
      }
    ],
    relations: {
      fa: null,
      mu: null,
      xiong: null,
      di: null,
      jie: null,
      mei: null,
      fu: null,
      qi: '外曾祖母',
      zi: '外祖父',
      nv: null
    }
  },
  {
    name: '外曾祖母',
    words: [
      {
        word: '大妈',
        id: 1762
      }
    ],
    relations: {
      fa: null,
      mu: null,
      xiong: null,
      di: null,
      jie: null,
      mei: null,
      fu: '外曾祖父',
      qi: null,
      zi: '外祖父',
      nv: null
    }
  },
  {
    name: '祖父',
    words: [
      {
        word: '阿公',
        id: 8
      }
    ],
    relations: {
      fa: '曾祖父',
      mu: '曾祖母',
      xiong: '伯祖父',
      di: '叔祖父',
      jie: '姑祖母',
      mei: '姑祖母',
      fu: null,
      qi: '祖母',
      zi: ['父亲', '伯父', '叔父'],
      nv: '姑母'
    }
  },
  {
    name: '祖母',
    words: [
      {
        word: '阿妈',
        id: 10
      }
    ],
    relations: {
      fa: null,
      mu: null,
      xiong: '舅祖父',
      di: '舅祖父',
      jie: '姨祖母',
      mei: '姨祖母',
      fu: '祖父',
      qi: null,
      zi: ['父亲', '伯父', '叔父'],
      nv: '姑母'
    }
  },
  {
    name: '伯祖父',
    words: [
      {
        word: '伯公',
        id: 270
      }
    ],
    relations: {
      fa: '曾祖父',
      mu: '曾祖母',
      xiong: '伯祖父',
      di: ['祖父', '伯祖父', '叔祖父'],
      jie: '姑祖母',
      mei: '姑祖母',
      fu: null,
      qi: '伯祖母',
      zi: null,
      nv: null
    }
  },

  {
    name: '伯祖母',
    words: [

      {
        word: '姆妈',
        id: null
      },
      {
        word: '伯妈',
        id: null
      }
    ],
    relations: {
      fa: null,
      mu: null,
      xiong: null,
      di: null,
      jie: null,
      mei: null,
      fu: '伯祖父',
      qi: null,
      zi: null,
      nv: null
    }
  },
  {
    name: '叔祖父',
    words: [
      {
        word: '叔公',
        id: 5512
      }
    ],
    relations: {
      fa: '曾祖父',
      mu: '曾祖母',
      xiong: ['祖父', '伯祖父', '叔祖父'],
      di: '叔祖父',
      jie: '姑祖母',
      mei: '姑祖母',
      fu: null,
      qi: '叔祖母',
      zi: null,
      nv: null
    }
  },
  {
    name: '叔祖母',
    words: [
      {
        word: '婶妈',
        id: 4817
      }
    ],
    relations: {
      fa: null,
      mu: null,
      xiong: null,
      di: null,
      jie: null,
      mei: null,
      fu: '叔祖父',
      qi: null,
      zi: null,
      nv: null
    }
  },
  {
    name: '姑祖母',
    words: [
      {
        word: '姑妈',
        id: null
      }
    ],
    relations: {
      fa: '曾祖父',
      mu: '曾祖母',
      xiong: ['祖父', '伯祖父', '叔祖父'],
      di: ['祖父', '伯祖父', '叔祖父'],
      jie: '姑祖母',
      mei: '姑祖母',
      fu: '姑祖父',
      qi: null,
      zi: null,
      nv: null
    }
  },
  {
    name: '姑祖父',
    words: [
      {
        word: '姑丈公',
        id: null
      }
    ],
    relations: {
      fa: null,
      mu: null,
      xiong: null,
      di: null,
      jie: null,
      mei: null,
      fu: null,
      qi: '姑祖母',
      zi: null,
      nv: null
    }
  },
  {
    name: '舅祖父',
    words: [
      {
        word: '舅公',
        id: 2413
      }
    ],
    relations: {
      fa: null,
      mu: null,
      xiong: '舅祖父',
      di: '舅祖父',
      jie: ['祖母', '姨祖母'],
      mei: ['祖母', '姨祖母'],
      fu: null,
      qi: '舅祖母',
      zi: null,
      nv: null
    }
  },
  {
    name: '舅祖母',
    words: [
      {
        word: '妗妈',
        id: 2315
      }
    ],
    relations: {
      fa: null,
      mu: null,
      xiong: null,
      di: null,
      jie: null,
      mei: null,
      fu: '舅祖父',
      qi: null,
      zi: null,
      nv: null
    }
  },
  {
    name: '姨祖母',
    words: [
      {
        word: '姨妈',
        id: 2922
      }
    ],
    relations: {
      fa: null,
      mu: null,
      xiong: '舅祖父',
      di: '舅祖父',
      jie: ['祖母', '姨祖母'],
      mei: ['祖母', '姨祖母'],
      fu: '姨祖父',
      qi: null,
      zi: null,
      nv: null
    }
  },
  {
    name: '姨祖父',
    words: [
      {
        word: '姨丈公',
        id: null
      }
    ],
    relations: {
      fa: null,
      mu: null,
      xiong: null,
      di: null,
      jie: null,
      mei: null,
      fu: null,
      qi: '姨祖母',
      zi: null,
      nv: null
    }
  },
  {
    name: '外祖父',
    words: [
      {
        word: '外头公',
        id: 2439
      }
    ],
    relations: {
      fa: '外曾祖父',
      mu: '外曾祖母',
      xiong: null,
      di: null,
      jie: null,
      mei: null,
      fu: null,
      qi: '外祖母',
      zi: '舅父',
      nv: ['母亲', '姨母']
    }
  },
  {
    name: '外祖母',
    words: [
      {
        word: '外头妈',
        id: 2441
      }
    ],
    relations: {
      fa: null,
      mu: null,
      xiong: null,
      di: null,
      jie: null,
      mei: null,
      fu: '外祖父',
      qi: null,
      zi: '舅父',
      nv: ['母亲', '姨母']
    }
  },
  {
    name: '父亲',
    words: [
      {
        word: '老父',
        id: null
      },
      {
        word: '阿爸',
        id: null
      }
    ],
    relations: {
      fa: '祖父',
      mu: '祖母',
      xiong: '伯父',
      di: '叔父',
      jie: '姑母',
      mei: '姑母',
      fu: null,
      qi: '母亲',
      zi: [
        '己身',
        '兄亲',
        '弟亲'
      ],
      nv: [
        '己身',
        '姊亲',
        '妹亲'
      ]
    }
  },
  {
    name: '母亲',
    words: [
      {
        word: '阿负',
        id: null
      },
      {
        word: '阿奶',
        id: null
      },
      {
        word: '阿嫡',
        id: null
      },
      {
        word: '娘奶',
        id: null
      },
      {
        word: '阿妸',
        id: null
      },
      {
        word: '依妸',
        id: null
      },
      {
        word: '妈妈',
        id: null
      },
      {
        word: '妈阿',
        id: null
      }
    ],
    relations: {
      fa: '外祖父',
      mu: '外祖母',
      xiong: '舅父',
      di: '舅父',
      jie: '姨母',
      mei: '姨母',
      fu: '父亲',
      qi: null,
      zi: [
        '己身',
        '兄亲',
        '弟亲'
      ],
      nv: [
        '己身',
        '姊亲',
        '妹亲'
      ]
    }
  },
  {
    name: '伯父',
    words: [
      {
        word: '阿伯',
        id: 13
      }
    ],
    relations: {
      fa: '祖父',
      mu: '祖母',
      xiong: '伯父',
      di: [
        '父亲',
        '伯父',
        '叔父'
      ],
      jie: '姑母',
      mei: '姑母',
      fu: null,
      qi: '伯母',
      zi: '堂兄弟',
      nv: '堂姊妹'
    }
  },
  {
    name: '伯母',
    words: [
      {
        word: '姆伯',
        id: 4048
      },
      {
        word: '阿姆',
        id: null
      }
    ],
    relations: {
      fa: null,
      mu: null,
      xiong: null,
      di: null,
      jie: null,
      mei: null,
      fu: '伯父',
      qi: null,
      zi: '堂兄弟',
      nv: '堂姊妹'
    }
  },
  {
    name: '叔父',
    words: [
      {
        word: '阿叔',
        id: 21
      }
    ],
    relations: {
      fa: '祖父',
      mu: '祖母',
      xiong: [
        '父亲',
        '伯父',
        '叔父'
      ],
      di: '叔父',
      jie: '姑母',
      mei: '姑母',
      fu: null,
      qi: '叔母',
      zi: '堂兄弟',
      nv: '堂姊妹'
    }
  },
  {
    name: '叔母',
    words: [
      {
        word: '阿婶',
        id: 36
      }
    ],
    relations: {
      fa: null,
      mu: null,
      xiong: null,
      di: null,
      jie: null,
      mei: null,
      fu: '叔父',
      qi: null,
      zi: '堂兄弟',
      nv: '堂姊妹'
    }
  },
  {
    name: '姑母',
    words: [
      {
        word: '阿姑',
        id: 29
      }
    ],
    relations: {
      fa: '祖父',
      mu: '祖母',
      xiong: [
        '父亲',
        '伯父',
        '叔父'
      ],
      di: [
        '父亲',
        '伯父',
        '叔父'
      ],
      jie: '姑母',
      mei: '姑母',
      fu: '姑父',
      qi: null,
      zi: '表兄弟',
      nv: '表姊妹'
    }
  },
  {
    name: '姑父',
    words: [
      {
        word: '姑丈',
        id: 2361
      }
    ],
    relations: {
      fa: null,
      mu: null,
      xiong: null,
      di: null,
      jie: null,
      mei: null,
      fu: null,
      qi: '姑母',
      zi: '表兄弟',
      nv: '表姊妹'
    }
  },
  {
    name: '舅父',
    words: [
      {
        word: '阿舅',
        id: 41
      }
    ],
    relations: {
      fa: '外祖父',
      mu: '外祖母',
      xiong: '舅父',
      di: '舅父',
      jie: [
        '姨母',
        '母亲'
      ],
      mei: [
        '姨母',
        '母亲'
      ],
      fu: null,
      qi: '舅母',
      zi: '表兄弟',
      nv: '表姊妹'
    }
  },
  {
    name: '舅母',
    words: [
      {
        word: '阿妗',
        id: 17
      }
    ],
    relations: {
      fa: null,
      mu: null,
      xiong: null,
      di: null,
      jie: null,
      mei: null,
      fu: '舅父',
      qi: null,
      zi: '表兄弟',
      nv: '表姊妹'
    }
  },
  {
    name: '姨母',
    words: [
      {
        word: '阿姨',
        id: 31
      }
    ],
    relations: {
      fa: '外祖父',
      mu: '外祖母',
      xiong: '舅父',
      di: '舅父',
      jie: ['母亲', '姨母'],
      mei: ['母亲', '姨母'],
      fu: '姨父',
      qi: null,
      zi: '表兄弟',
      nv: '表姊妹'
    }
  },
  {
    name: '姨父',
    words: [
      {
        word: '姨丈',
        id: 2921
      }
    ],
    relations: {
      fa: null,
      mu: null,
      xiong: null,
      di: null,
      jie: null,
      mei: null,
      fu: null,
      qi: '姨母',
      zi: '表兄弟',
      nv: '表姊妹'
    }
  },
  {
    name: '兄亲',
    words: [
      {
        word: '阿兄',
        id: 9
      }
    ],
    relations: {
      fa: '父亲',
      mu: '母亲',
      xiong: '兄亲',
      di: [
        '兄亲',
        '己身',
        '弟亲'
      ],
      jie: '姊亲',
      mei: [
        '己身',
        '妹亲',
        '姊亲'
      ],
      fu: null,
      qi: '兄妇',
      zi: '侄男',
      nv: '侄女'
    }
  },
  {
    name: '兄妇',
    words: [
      {
        word: '阿嫂',
        id: 37
      }
    ],
    relations: {
      fa: null,
      mu: null,
      xiong: null,
      di: null,
      jie: null,
      mei: null,
      fu: '兄亲',
      qi: null,
      zi: '侄男',
      nv: '侄女'
    }
  },
  {
    name: '弟亲',
    words: [
      {
        word: '阿弟',
        id: 14
      }
    ],
    relations: {
      fa: '父亲',
      mu: '母亲',
      xiong: [
        '己身',
        '兄亲',
        '弟亲'
      ],
      di: '弟亲',
      jie: [
        '己身',
        '姊亲',
        '妹亲'
      ],
      mei: '妹亲',
      fu: null,
      qi: '弟妇',
      zi: '侄男',
      nv: '侄女'
    }
  },
  {
    name: '弟妇',
    words: [
      {
        word: '弟妇',
        id: 1476
      },
      {
        word: '阿弟妇',
        id: null
      }
    ],
    relations: {
      fa: null,
      mu: null,
      xiong: null,
      di: null,
      jie: null,
      mei: null,
      fu: '弟亲',
      qi: null,
      zi: '侄男',
      nv: '侄女'
    }
  },
  {
    name: '侄男',
    words: [
      {
        word: '乃侄',
        id: 3854
      }
    ],
    relations: {
      fa: [
        '兄亲',
        '弟亲'
      ],
      mu: [
        '兄妇',
        '弟妇'
      ],
      xiong: '侄男',
      di: '侄男',
      jie: '侄女',
      mei: '侄女',
      fu: null,
      qi: null,
      zi: null,
      nv: null
    }
  },
  {
    name: '侄女',
    words: [
      {
        word: '乃侄女',
        id: 3855
      }
    ],
    relations: {
      fa: [
        '兄亲',
        '弟亲'
      ],
      mu: [
        '兄妇',
        '弟妇'
      ],
      xiong: '侄男',
      di: '侄男',
      jie: '侄女',
      mei: '侄女',
      fu: null,
      qi: null,
      zi: null,
      nv: null
    }
  },
  {
    name: '姊亲',
    words: [
      {
        word: '阿姊',
        id: 19
      }
    ],
    relations: {
      fa: '父亲',
      mu: '母亲',
      xiong: '兄亲',
      di: [
        '己身',
        '弟亲',
        '兄亲'
      ],
      jie: '姊亲',
      mei: [
        '己身',
        '妹亲',
        '姊亲'
      ],
      fu: '姊夫',
      qi: null,
      zi: '甥男',
      nv: '甥女'
    }
  },
  {
    name: '姊夫',
    words: [
      {
        word: '阿姊夫',
        id: 20
      },
      {
        word: '阿丈',
        id: null
      }
    ],
    relations: {
      fa: null,
      mu: null,
      xiong: null,
      di: null,
      jie: null,
      mei: null,
      fu: null,
      qi: '姊亲',
      zi: '甥男',
      nv: '甥女'
    }
  },
  {
    name: '妹亲',
    words: [
      {
        word: '阿妹',
        id: 26
      }
    ],
    relations: {
      fa: '父亲',
      mu: '母亲',
      xiong: [
        '己身',
        '兄亲',
        '弟亲'
      ],
      di: '弟亲',
      jie: [
        '己身',
        '姊亲',
        '妹亲'
      ],
      mei: '妹亲',
      fu: '妹夫',
      qi: null,
      zi: '甥男',
      nv: '甥女'
    }
  },
  {
    name: '妹夫',
    words: [
      {
        word: '阿妹夫',
        id: 27
      }
    ],
    relations: {
      fa: null,
      mu: null,
      xiong: null,
      di: null,
      jie: null,
      mei: null,
      fu: null,
      qi: '妹亲',
      zi: '甥男',
      nv: '甥女'
    }
  },
  {
    name: '甥男',
    words: [
      {
        word: '乃甥',
        id: 3856
      }
    ],
    relations: {
      fa: [
        '姊亲',
        '妹亲'
      ],
      mu: [
        '姊夫',
        '妹夫'
      ],
      xiong: '甥男',
      di: '甥男',
      jie: '甥女',
      mei: '甥女',
      fu: null,
      qi: null,
      zi: null,
      nv: null
    }
  },
  {
    name: '甥女',
    words: [
      {
        word: '乃甥女',
        id: 3857
      }
    ],
    relations: {
      fa: [
        '姊亲',
        '妹亲'
      ],
      mu: [
        '姊夫',
        '妹夫'
      ],
      xiong: '甥男',
      di: '甥男',
      jie: '甥女',
      mei: '甥女',
      fu: null,
      qi: null,
      zi: null,
      nv: null
    }
  },
  {
    name: '堂兄弟',
    words: [
      {
        word: '叔伯兄弟',
        id: 4599
      }
    ],
    relations: {
      fa: [
        '伯父',
        '叔父'
      ],
      mu: [
        '伯母',
        '婶婶'
      ],
      xiong: '堂兄弟',
      di: '堂兄弟',
      jie: '堂姊妹',
      mei: '堂姊妹',
      fu: null,
      qi: null,
      zi: '堂侄男',
      nv: '堂侄女'
    }
  },
  {
    name: '堂姊妹',
    words: [
      {
        word: '叔伯姐妹囝',
        id: 4600
      }
    ],
    relations: {
      fa: [
        '伯父',
        '叔父'
      ],
      mu: [
        '伯母',
        '婶婶'
      ],
      xiong: '堂兄弟',
      di: '堂兄弟',
      jie: '堂姊妹',
      mei: '堂姊妹',
      fu: null,
      qi: null,
      zi: '堂甥男',
      nv: '堂甥女'
    }
  },
  {
    name: '表兄弟',
    words: [
      {
        word: '表兄弟',
        id: null
      }
    ],
    relations: {
      fa: [
        '姑丈',
        '姨丈'
      ],
      mu: [
        '姑妈',
        '姨妈'
      ],
      xiong: '表兄弟',
      di: '表兄弟',
      jie: '表姊妹',
      mei: '表姊妹',
      fu: null,
      qi: null,
      zi: '表侄男',
      nv: '表侄女'
    }
  },
  {
    name: '表姊妹',
    words: [
      {
        word: '表姊妹',
        id: 499
      }
    ],
    relations: {
      fa: [
        '姑丈',
        '姨丈'
      ],
      mu: [
        '姑妈',
        '姨妈'
      ],
      xiong: '表兄弟',
      di: '表兄弟',
      jie: '表姊妹',
      mei: '表姊妹',
      fu: null,
      qi: null,
      zi: '表甥男',
      nv: '表甥女'
    }
  },
  {
    name: '男亲',
    words: [
      {
        word: '囝',
        id: 2508
      },
      {
        word: '大囝',
        id: 1759
      },
      {
        word: '长子',
        id: 1910
      },
      {
        word: '细囝',
        id: 4550
      },
      {
        word: '尾囝',
        id: 739
      }
    ],
    relations: {
      fa: ['己身', '夫亲'],
      mu: ['己身', '妻亲'],
      xiong: '男亲',
      di: '男亲',
      jie: '女亲',
      mei: '女亲',
      fu: null,
      qi: '儿妇',
      zi: '孙儿',
      nv: '孙女'
    }
  },
  {
    name: '儿妇',
    words: [
      {
        word: '新妇',
        id: 4807
      },
      {
        word: '囝新妇',
        id: 2512
      }
    ],
    relations: {
      fa: '亲家公（儿）',
      mu: '亲家母（儿）',
      xiong: null,
      di: null,
      jie: null,
      mei: null,
      fu: '男亲',
      qi: null,
      zi: '孙儿',
      nv: '孙女'
    }
  },
  {
    name: '亲家公（儿）',
    words: [
      {
        word: '亲家',
        id: 1062
      }

    ],
    relations: {
      fa: null,
      mu: null,
      xiong: null,
      di: null,
      jie: null,
      mei: null,
      fu: null,
      qi: '亲家母（儿）',
      zi: null,
      nv: '儿妇'
    }
  },
  {
    name: '亲家母（儿）',
    words: [
      {
        word: '亲家姆',
        id: 1063
      }

    ],
    relations: {
      fa: null,
      mu: null,
      xiong: null,
      di: null,
      jie: null,
      mei: null,
      fu: '亲家公（儿）',
      qi: null,
      zi: null,
      nv: '儿妇'
    }
  },
  {
    name: '女亲',
    words: [
      {
        word: '囝',
        id: 2508
      }
    ],
    relations: {
      fa: ['己身', '夫亲'],
      mu: ['己身', '妻亲'],
      xiong: '男亲',
      di: '男亲',
      jie: '女亲',
      mei: '女亲',
      fu: '女婿',
      qi: null,
      zi: '外孙儿',
      nv: '外孙女'
    }
  },
  {
    name: '女婿',
    words: [
      {
        word: '囝婿',
        id: 2511
      }
    ],
    relations: {
      fa: '亲家公（女）',
      mu: '亲家母（女）',
      xiong: null,
      di: null,
      jie: null,
      mei: null,
      fu: null,
      qi: '女亲',
      zi: '外孙儿',
      nv: '外孙女'
    }
  },
  {
    name: '亲家公（女）',
    words: [
      {
        word: '亲家',
        id: 1062
      }

    ],
    relations: {
      fa: null,
      mu: null,
      xiong: null,
      di: null,
      jie: null,
      mei: null,
      fu: null,
      qi: '亲家母（女）',
      zi: '女婿',
      nv: null
    }
  },
  {
    name: '亲家母（女）',
    words: [
      {
        word: '亲家姆',
        id: 1063
      }

    ],
    relations: {
      fa: null,
      mu: null,
      xiong: null,
      di: null,
      jie: null,
      mei: null,
      fu: '亲家公（女）',
      qi: null,
      zi: '女婿',
      nv: null
    }
  },
  {
    name: '孙儿',
    words: [
      {
        word: '孙',
        id: 4929
      },
      {
        word: '里头孙',
        id: 3553
      },
      {
        word: '正孙',
        id: 5579
      }
    ],
    relations: {
      fa: '男亲',
      mu: '儿妇',
      xiong: '孙儿',
      di: '孙儿',
      jie: '孙女',
      mei: '孙女',
      fu: null,
      qi: '孙妇',
      zi: '曾孙',
      nv: '曾孙'
    }
  },
  {
    name: '孙女',
    words: [
      {
        word: '婶娘孙',
        id: null
      },
      {
        word: '里头孙',
        id: 3553
      },
      {
        word: '正孙',
        id: 5579
      },
      {
        word: '子孙',
        id: null
      }
    ],
    relations: {
      fa: '男亲',
      mu: '儿妇',
      xiong: '孙儿',
      di: '孙儿',
      jie: '孙女',
      mei: '孙女',
      fu: '孙婿',
      qi: null,
      zi: '曾外孙',
      nv: '曾外孙'
    }
  },
  {
    name: '外孙儿',
    words: [
      {
        word: '孙',
        id: 4929
      }
    ],
    relations: {
      fa: '女婿',
      mu: '女亲',
      xiong: '孙儿',
      di: '孙儿',
      jie: '孙女',
      mei: '孙女',
      fu: null,
      qi: '孙妇',
      zi: '曾孙',
      nv: '曾孙'
    }
  },
  {
    name: '曾孙',
    words: [
      {
        word: '曾孙',
        id: 5495
      }
    ],
    relations: {
      fa: '孙儿',
      mu: '孙妇',
      xiong: '曾孙',
      di: '曾孙',
      jie: '曾孙',
      mei: '曾孙',
      fu: null,
      qi: null,
      zi: '玄孙',
      nv: null
    }
  },
  {
    name: '曾外孙',
    words: [
      {
        word: '曾孙',
        id: 5495
      }
    ],
    relations: {
      fa: '孙女',
      mu: '孙婿',
      xiong: '曾外孙',
      di: '曾外孙',
      jie: '曾外孙',
      mei: '曾外孙',
      fu: null,
      qi: null,
      zi: null,
      nv: null
    }
  },
  {
    name: '玄孙',
    words: [
      {
        word: '玄孙',
        id: 2646
      }
    ],
    relations: {
      fa: '曾孙',
      mu: null,
      xiong: null,
      di: null,
      jie: null,
      mei: null,
      fu: null,
      qi: null,
      zi: null,
      nv: null
    }
  },
  {
    name: '夫亲',
    words: [
      {
        word: '老公',
        id: 3463
      }
    ],
    relations: {
      fa: '公父',
      mu: '婆母',
      xiong: '伯兄',
      di: '叔弟',
      jie: '姑姊妹',
      mei: '姑姊妹',
      fu: null,
      qi: '己身',
      zi: '男亲',
      nv: '女亲'
    }
  },
  {
    name: '公父',
    words: [
      {
        word: '大官',
        id: 1543
      }
    ],
    relations: {
      fa: null,
      mu: null,
      xiong: null,
      di: null,
      jie: null,
      mei: null,
      fu: null,
      qi: '婆母',
      zi: ['夫亲', '伯兄', '叔弟'],
      nv: '姑姊妹'
    }
  },
  {
    name: '婆母',
    words: [
      {
        word: '大家',
        id: 1545
      }
    ],
    relations: {
      fa: null,
      mu: null,
      xiong: null,
      di: null,
      jie: null,
      mei: null,
      fu: '公父',
      qi: null,
      zi: ['夫亲', '伯兄', '叔弟'],
      nv: '姑姊妹'
    }
  },
  {
    name: '伯兄',
    words: [
      {
        word: '大伯',
        id: null
      }

    ],
    relations: {
      fa: '公父',
      mu: '婆母',
      xiong: '伯兄',
      di: ['夫亲', '伯兄', '叔弟'],
      jie: '姑姊妹',
      mei: '姑姊妹',
      fu: null,
      qi: '伯兄妇',
      zi: null,
      nv: null
    }
  },
  {
    name: '伯兄妇',
    words: [
      {
        word: '伯叔婶',
        id: 271
      }
    ],
    relations: {
      fa: null,
      mu: null,
      xiong: null,
      di: null,
      jie: null,
      mei: null,
      fu: '伯兄',
      qi: null,
      zi: null,
      nv: null
    }
  },
  {
    name: '叔弟',
    words: [
      {
        word: '小郎',
        id: 4758
      }
    ],
    relations: {
      fa: '公父',
      mu: '婆母',
      xiong: ['夫亲', '伯兄', '叔弟'],
      di: '叔弟',
      jie: '姑姊妹',
      mei: '姑姊妹',
      fu: null,
      qi: '叔弟妇',
      zi: null,
      nv: null
    }
  },
  {
    name: '叔弟妇',
    words: [
      {
        word: '伯叔婶',
        id: 271
      }
    ],
    relations: {
      fa: null,
      mu: null,
      xiong: null,
      di: null,
      jie: null,
      mei: null,
      fu: '叔弟',
      qi: null,
      zi: null,
      nv: null
    }
  },
  {
    name: '姑姊妹',
    words: [
      {
        word: '小姑',
        id: 4760
      }
    ],
    relations: {
      fa: '公父',
      mu: '婆母',
      xiong: ['夫亲', '伯兄', '叔弟'],
      di: ['夫亲', '伯兄', '叔弟'],
      jie: null,
      mei: null,
      fu: null,
      qi: null,
      zi: null,
      nv: null
    }
  },
  {
    name: '妻亲',
    words: [
      {
        word: '老妈',
        id: 3468
      }
    ],
    relations: {
      fa: '丈父',
      mu: '丈母',
      xiong: '舅兄',
      di: '舅弟',
      jie: '姨姊妹',
      mei: '姨姊妹',
      fu: '己身',
      qi: null,
      zi: '男亲',
      nv: '女亲'
    }
  },
  {
    name: '丈父',
    words: [
      {
        word: '丈侬',
        id: 1644
      }
    ],
    relations: {
      fa: null,
      mu: null,
      xiong: null,
      di: null,
      jie: null,
      mei: null,
      fu: null,
      qi: '丈母',
      zi: [
        '舅兄',
        '舅弟'
      ],
      nv: [
        '妻亲',
        '姨姊妹'
      ]
    }
  },
  {
    name: '丈母',
    words: [
      {
        word: '丈母',
        id: 1643
      }
    ],
    relations: {
      fa: null,
      mu: null,
      xiong: null,
      di: null,
      jie: null,
      mei: null,
      fu: '丈父',
      qi: null,
      zi: [
        '舅兄',
        '舅弟'
      ],
      nv: [
        '妻亲',
        '姨姊妹'
      ]
    }
  },
  {
    name: '舅兄',
    words: [
      {
        word: '',
        id: null
      }
    ],
    relations: {
      fa: '丈父',
      mu: '丈母',
      xiong: '舅兄',
      di: [
        '舅弟',
        '舅兄'
      ],
      jie: '姨姊妹',
      mei: [
        '姨姊妹',
        '妻亲'
      ],
      fu: null,
      qi: '舅兄妇',
      zi: null,
      nv: null
    }
  },
  {
    name: '舅兄妇',
    words: [
      {
        word: '',
        id: null
      }
    ],
    relations: {
      fa: null,
      mu: null,
      xiong: null,
      di: null,
      jie: null,
      mei: null,
      fu: '舅兄',
      qi: null,
      zi: null,
      nv: null
    }
  },
  {
    name: '舅弟',
    words: [
      {
        word: '阿舅囝',
        id: 42
      }
    ],
    relations: {
      fa: '丈父',
      mu: '丈母',
      xiong: [
        '舅弟',
        '舅兄'
      ],
      di: '舅弟',
      jie: [
        '姨姊妹',
        '妻亲'
      ],
      mei: '姨姊妹',

      fu: null,
      qi: '舅弟妇',
      zi: null,
      nv: null
    }
  },
  {
    name: '舅弟妇',
    words: [
      {
        word: '阿妗囝',
        id: 17
      }
    ],
    relations: {
      fa: null,
      mu: null,
      xiong: null,
      di: null,
      jie: null,
      mei: null,
      fu: '舅弟',
      qi: null,
      zi: null,
      nv: null
    }
  },
  {
    name: '姨姊妹',
    words: [
      {
        word: '阿姨囝',
        id: 32
      }
    ],
    relations: {
      fa: '丈父',
      mu: '丈母',
      xiong: [
        '舅弟',
        '舅兄'
      ],
      di: [
        '舅弟',
        '舅兄'
      ],
      jie: [
        '姨姊妹',
        '妻亲'
      ],
      mei: [
        '姨姊妹',
        '妻亲'
      ],
      fu: null,
      qi: '姨姊妹夫',
      zi: null,
      nv: null
    }
  },
  {
    name: '姨姊妹夫',
    words: [
      {
        word: '襟友',
        id: 3273
      }
    ],
    relations: {
      fa: null,
      mu: null,
      xiong: null,
      di: null,
      jie: null,
      mei: null,
      fu: null,
      qi: '姨姊妹',
      zi: null,
      nv: null
    }
  }
]

export const find = function (next) {
  const index = relative.findIndex((item) => {
    return item.name === next
  })
  if (index === -1
  ) {
    return {
      name: next,
      words: [],
      relations: {
        fa: null,
        mu: null,
        xiong: null,
        di: null,
        jie: null,
        mei: null,
        fu: null,
        qi: null,
        zi: null,
        nv: null
      }
    }
  } else {
    return relative[index]
  }
}
