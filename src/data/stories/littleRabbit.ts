import { Story } from '../../types/story';

// ============================================================
// "The Little Rabbit and the Moon" / "Chú Thỏ Nhỏ và Mặt Trăng"
// An original bilingual children's story for ages 3–8
// ============================================================

export const LITTLE_RABBIT_STORY: Story = {
  id: 'little-rabbit-moon',
  title: {
    en: 'The Little Rabbit and the Moon',
    vi: 'Chú Thỏ Nhỏ và Mặt Trăng',
  },
  description: {
    en: 'Every night, a little rabbit gazes at the moon and wonders if they could ever be friends. A gentle story about wonder, courage, and the magic of bedtime.',
    vi: 'Mỗi đêm, một chú thỏ nhỏ nhìn lên mặt trăng và tự hỏi liệu họ có thể trở thành bạn không. Một câu chuyện nhẹ nhàng về sự kỳ diệu, lòng dũng cảm, và phép màu của giờ đi ngủ.',
  },
  coverImage: 'rabbit_cover',
  duration: '5 min',
  ageRange: '3–8 years',
  category: 'Bedtime',
  languages: ['en', 'vi'],
  art: {
    mood: 'Soft, sleepy wonder; an original bedtime lullaby.',
    setting: 'A quiet meadow with an old oak, a burrow and a big friendly moon.',
    light: 'Warm sunset fading into sage-and-ink night with a buttery moon.',
    motifs: ['white rabbit Mochi', 'full moon', 'meadow flowers', 'burrow'],
    avoid: ['Vietnamese folk-tale settings', 'busy compositions'],
    palette: {
      sky: '#141A24',
      skyLow: '#2C3A33',
      ground: '#3D4A30',
      groundDeep: '#1E2B1A',
      accent: '#BFE5D8',
      glow: '#F7E8B0',
      ink: '#0D1117',
      paper: '#EEF3EC',
    },
  },
  pages: [
    {
      id: 'page-1',
      image: 'rabbit_page1',
      sentences: [
        {
          id: 'p1-s1',
          en: 'Once upon a time, in a meadow full of soft green grass, there lived a little rabbit named Mochi.',
          vi: 'Ngày xửa ngày xưa, trên một cánh đồng phủ đầy cỏ xanh mềm mại, có một chú thỏ nhỏ tên là Mochi.',
        },
        {
          id: 'p1-s2',
          en: 'Mochi had the fluffiest white ears and the brightest eyes you have ever seen.',
          vi: 'Mochi có đôi tai trắng mịn nhất và đôi mắt sáng nhất mà bạn từng thấy.',
        },
        {
          id: 'p1-s3',
          en: 'Every evening, when the sun went to sleep, Mochi would sit by the old oak tree and gaze up at the sky.',
          vi: 'Mỗi buổi tối, khi mặt trời đi ngủ, Mochi lại ngồi bên cây sồi già và ngước nhìn lên bầu trời.',
        },
      ],
    },
    {
      id: 'page-2',
      image: 'rabbit_page2',
      sentences: [
        {
          id: 'p2-s1',
          en: 'High above, a round golden moon smiled down at the meadow.',
          vi: 'Trên cao, một vầng trăng tròn vàng óng mỉm cười chiếu xuống cánh đồng.',
        },
        {
          id: 'p2-s2',
          en: '"Hello, Moon," Mochi whispered softly. "You are so beautiful and so very far away."',
          vi: '"Xin chào, Mặt Trăng," Mochi thì thầm nhẹ nhàng. "Bạn thật đẹp và rất xa xôi."',
        },
        {
          id: 'p2-s3',
          en: 'The moon shimmered and seemed to wink, as if it had heard every word.',
          vi: 'Mặt trăng lấp lánh và dường như nháy mắt, như thể đã nghe thấy từng lời.',
        },
      ],
    },
    {
      id: 'page-3',
      image: 'rabbit_page3',
      sentences: [
        {
          id: 'p3-s1',
          en: 'One night, Mochi decided to be very brave.',
          vi: 'Một đêm nọ, Mochi quyết định trở nên rất dũng cảm.',
        },
        {
          id: 'p3-s2',
          en: 'He hopped to the top of the tallest hill, stretched his ears up high, and called out: "Moon! Can we be friends?"',
          vi: 'Chú nhảy lên đỉnh đồi cao nhất, dựng tai lên thật cao và gọi: "Mặt Trăng ơi! Chúng mình có thể là bạn không?"',
        },
        {
          id: 'p3-s3',
          en: 'The whole meadow fell silent. Even the crickets stopped their singing to listen.',
          vi: 'Cả cánh đồng im lặng. Ngay cả những con dế cũng ngừng hát để lắng nghe.',
        },
      ],
    },
    {
      id: 'page-4',
      image: 'rabbit_page4',
      sentences: [
        {
          id: 'p4-s1',
          en: 'Then, something magical happened. The moon glowed brighter and brighter, filling the meadow with warm silver light.',
          vi: 'Rồi, điều kỳ diệu xảy ra. Mặt trăng sáng lên ngày càng rực rỡ, tràn ngập cánh đồng bằng ánh sáng bạc ấm áp.',
        },
        {
          id: 'p4-s2',
          en: 'A gentle voice floated down like a lullaby: "Little rabbit, I have always been your friend."',
          vi: 'Một giọng nói nhẹ nhàng vang xuống như tiếng ru: "Chú thỏ nhỏ ơi, ta luôn là bạn của con."',
        },
        {
          id: 'p4-s3',
          en: '"Every night, I shine my light so you can see the path and dream sweet dreams."',
          vi: '"Mỗi đêm, ta chiếu ánh sáng để con thấy đường và có những giấc mơ ngọt ngào."',
        },
      ],
    },
    {
      id: 'page-5',
      image: 'rabbit_page5',
      sentences: [
        {
          id: 'p5-s1',
          en: 'Mochi smiled the biggest smile a rabbit has ever smiled.',
          vi: 'Mochi mỉm cười nụ cười lớn nhất mà một chú thỏ từng mỉm cười.',
        },
        {
          id: 'p5-s2',
          en: 'He hopped back to his cozy burrow, curled up in his soft hay bed, and closed his eyes.',
          vi: 'Chú nhảy trở về hang ấm cúng của mình, cuộn tròn trong đệm rơm mềm và nhắm mắt lại.',
        },
        {
          id: 'p5-s3',
          en: 'Above, the moon kept watch all night long. And Mochi slept peacefully, knowing he was never alone.',
          vi: 'Trên cao, mặt trăng canh gác suốt đêm. Và Mochi ngủ bình yên, biết rằng chú chưa bao giờ cô đơn.',
        },
      ],
    },
    {
      id: 'page-6',
      image: 'rabbit_page6',
      sentences: [
        {
          id: 'p6-s1',
          en: 'Goodnight, little Mochi. Goodnight, golden moon.',
          vi: 'Chúc ngủ ngon, chú thỏ Mochi nhỏ. Chúc ngủ ngon, vầng trăng vàng ơi.',
        },
        {
          id: 'p6-s2',
          en: 'And goodnight to you, dear reader. Close your eyes and dream of meadows, moons, and new friends.',
          vi: 'Và chúc ngủ ngon, bạn đọc thân mến. Hãy nhắm mắt và mơ về những cánh đồng, ánh trăng, và những người bạn mới.',
        },
      ],
    },
  ],
};

// The full catalogue (including this story) is exported from ./index.ts

