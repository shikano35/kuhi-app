import { HaikuMonument } from '@/types/haiku';

export const mockHaikuMonuments: HaikuMonument[] = [
  {
    id: 1,
    inscription: '冬牡丹千鳥よ雪のほととぎす',
    commentary:
      'この句は、「野ざらし紀行」の旅の折、貞亨元年の晩秋に大垣の俳人木因と共に本統寺第三世大谷琢恵（俳号古益）に招かれた際、一夜を過ごして詠んだといわれている',
    kigo: '冬牡丹,千鳥,雪,ほととぎす',
    season: '冬',
    is_reliable: true,
    has_reverse_inscription: true,
    material: null,
    total_height: null,
    width: null,
    depth: null,
    established_date: '昭和12年4月',
    established_year: '1937-4',
    founder: '小林雨月',
    monument_type: '句碑',
    designation_status: null,
    photo_url: '/images/monuments/sample1.jpg',
    photo_date: null,
    photographer: null,
    model_3d_url: null,
    remarks: null,
    created_at: '2025-05-11 16:02:33',
    updated_at: '2025-05-11 16:02:33',
    poet_id: 1,
    source_id: 1,
    location_id: 1,
    poets: [
      {
        id: 1,
        name: '松尾芭蕉',
        biography:
          '滑稽や諧謔を主としていた俳諧を、蕉風と呼ばれる芸術性の極めて高い句風として確立し、後世では俳聖として世界的にも知られる、日本史上最高の俳諧師の一人',
        link_url:
          'https://ja.wikipedia.org/wiki/%E6%9D%BE%E5%B0%BE%E8%8A%AD%E8%95%89',
        image_url: '/images/poets/basho.jpg',
        created_at: '2025-05-11 15:56:40',
        updated_at: '2025-05-11 15:56:40',
      },
    ],
    sources: [
      {
        id: 1,
        title: '俳句のくに・三重',
        author: '三重県庁',
        publisher: '三重県庁',
        source_year: 2011,
        url: 'https://www.bunka.pref.mie.lg.jp/haiku/',
        created_at: '2025-05-11 15:54:14',
        updated_at: '2025-05-11 15:54:14',
      },
    ],
    locations: [
      {
        id: 1,
        prefecture: '三重県',
        region: '東海',
        municipality: '桑名市',
        address: '桑名市北寺町47',
        place_name: '本統寺',
        latitude: 35.065502,
        longitude: 136.692193,
      },
    ],
  },
  {
    id: 2,
    inscription: '閑さや岩にしみ入る蝉の声',
    commentary: '奥の細道の旅の途中、立石寺（山寺）を訪れた際に詠んだ名句',
    kigo: '蝉',
    season: '夏',
    is_reliable: true,
    has_reverse_inscription: false,
    material: '御影石',
    total_height: 150,
    width: 50,
    depth: 20,
    established_date: '昭和35年8月',
    established_year: '1960-8',
    founder: '山形俳句会',
    monument_type: '句碑',
    designation_status: '市指定文化財',
    photo_url: '/images/monuments/sample2.jpg',
    photo_date: '2023-07-15',
    photographer: '山田太郎',
    model_3d_url: null,
    remarks: '山寺の入口付近に設置',
    created_at: '2025-05-12 10:23:45',
    updated_at: '2025-05-12 10:23:45',
    poet_id: 1,
    source_id: 2,
    location_id: 2,
    poets: [
      {
        id: 1,
        name: '松尾芭蕉',
        biography:
          '滑稽や諧謔を主としていた俳諧を、蕉風と呼ばれる芸術性の極めて高い句風として確立し、後世では俳聖として世界的にも知られる、日本史上最高の俳諧師の一人',
        link_url:
          'https://ja.wikipedia.org/wiki/%E6%9D%BE%E5%B0%BE%E8%8A%AD%E8%95%89',
        image_url: '/images/poets/basho.jpg',
        created_at: '2025-05-11 15:56:40',
        updated_at: '2025-05-11 15:56:40',
      },
    ],
    sources: [
      {
        id: 2,
        title: '俳聖芭蕉の足跡',
        author: '山形文学協会',
        publisher: '山形出版',
        source_year: 2015,
        url: null,
        created_at: '2025-05-12 09:34:21',
        updated_at: '2025-05-12 09:34:21',
      },
    ],
    locations: [
      {
        id: 2,
        prefecture: '山形県',
        region: '東北',
        municipality: '山形市',
        address: '山形市山寺4456-1',
        place_name: '立石寺',
        latitude: 38.311707,
        longitude: 140.430944,
      },
    ],
  },
  {
    id: 3,
    inscription: '菜の花や月は東に日は西に',
    commentary: '春の夕暮れ時、西に沈みゆく太陽と東に昇る月を詠んだ句',
    kigo: '菜の花',
    season: '春',
    is_reliable: true,
    has_reverse_inscription: false,
    material: '大理石',
    total_height: 120,
    width: 40,
    depth: 15,
    established_date: '平成元年4月',
    established_year: '1989-4',
    founder: '俳句愛好会',
    monument_type: '句碑',
    designation_status: null,
    photo_url: '/images/monuments/sample3.jpg',
    photo_date: '2022-04-10',
    photographer: '鈴木花子',
    model_3d_url: null,
    remarks: '公園内の菜の花畑の傍に設置',
    created_at: '2025-05-15 14:37:22',
    updated_at: '2025-05-15 14:37:22',
    poet_id: 2,
    source_id: 3,
    location_id: 3,
    poets: [
      {
        id: 2,
        name: '与謝蕪村',
        biography:
          '江戸時代中期の俳人、画家。芭蕉、一茶と共に日本の三大俳人に数えられる。',
        link_url:
          'https://ja.wikipedia.org/wiki/%E4%B8%8E%E8%AC%9D%E8%95%AA%E6%9D%91',
        image_url: '/images/poets/buson.jpg',
        created_at: '2025-05-13 11:24:53',
        updated_at: '2025-05-13 11:24:53',
      },
    ],
    sources: [
      {
        id: 3,
        title: '日本の俳句名所',
        author: '俳句文学研究会',
        publisher: '文学出版社',
        source_year: 2018,
        url: 'https://www.haiku-literature.jp',
        created_at: '2025-05-14 16:42:18',
        updated_at: '2025-05-14 16:42:18',
      },
    ],
    locations: [
      {
        id: 3,
        prefecture: '京都府',
        region: '近畿',
        municipality: '京都市',
        address: '京都市北区上賀茂神社前',
        place_name: '賀茂神社',
        latitude: 35.058982,
        longitude: 135.751926,
      },
    ],
  },
  {
    id: 4,
    inscription: '古池や蛙飛び込む水の音',
    commentary: '芭蕉の代表作として広く知られる名句',
    kigo: '蛙',
    season: '春',
    is_reliable: true,
    has_reverse_inscription: false,
    material: '花崗岩',
    total_height: 180,
    width: 60,
    depth: 30,
    established_date: '昭和25年5月',
    established_year: '1950-5',
    founder: '芭蕉顕彰会',
    monument_type: '句碑',
    designation_status: '国指定史跡',
    photo_url: '/images/monuments/sample4.jpg',
    photo_date: '2023-05-03',
    photographer: '佐藤次郎',
    model_3d_url: null,
    remarks: '芭蕉記念館庭園内に設置',
    created_at: '2025-05-20 09:12:37',
    updated_at: '2025-05-20 09:12:37',
    poet_id: 1,
    source_id: 4,
    location_id: 4,
    poets: [
      {
        id: 1,
        name: '松尾芭蕉',
        biography:
          '滑稽や諧謔を主としていた俳諧を、蕉風と呼ばれる芸術性の極めて高い句風として確立し、後世では俳聖として世界的にも知られる、日本史上最高の俳諧師の一人',
        link_url:
          'https://ja.wikipedia.org/wiki/%E6%9D%BE%E5%B0%BE%E8%8A%AD%E8%95%89',
        image_url: '/images/poets/basho.jpg',
        created_at: '2025-05-11 15:56:40',
        updated_at: '2025-05-11 15:56:40',
      },
    ],
    sources: [
      {
        id: 4,
        title: '芭蕉句碑巡り',
        author: '日本文学研究所',
        publisher: '俳句出版',
        source_year: 2010,
        url: null,
        created_at: '2025-05-19 13:24:56',
        updated_at: '2025-05-19 13:24:56',
      },
    ],
    locations: [
      {
        id: 4,
        prefecture: '滋賀県',
        region: '近畿',
        municipality: '大津市',
        address: '大津市紫雲山',
        place_name: '芭蕉記念館',
        latitude: 35.017736,
        longitude: 135.854501,
      },
    ],
  },
];

export const mockPoets = mockHaikuMonuments.reduce<
  Record<string, (typeof mockHaikuMonuments)[0]['poets'][0]>
>((acc, monument) => {
  monument.poets.forEach((poet) => {
    acc[poet.id] = poet;
  });
  return acc;
}, {});

export const mockLocations = mockHaikuMonuments.reduce<
  Record<string, (typeof mockHaikuMonuments)[0]['locations'][0]>
>((acc, monument) => {
  monument.locations.forEach((location) => {
    acc[location.id] = location;
  });
  return acc;
}, {});
