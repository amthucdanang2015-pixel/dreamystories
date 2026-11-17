// ============================================================
// Story Vocabulary Dictionary for Learning Mode
// Maps common English words in the story to Vietnamese translations,
// pronunciation hints, and contextual meanings.
// ============================================================

export interface WordDefinition {
  word: string;
  vi: string;
  phonetic: string;
  partOfSpeech: string;
  exampleEn: string;
  exampleVi: string;
}

export const STORY_VOCABULARY: Record<string, WordDefinition> = {
  rabbit: {
    word: 'rabbit',
    vi: 'chú thỏ',
    phonetic: '/ˈræb.ɪt/',
    partOfSpeech: 'noun',
    exampleEn: 'The little rabbit hopped across the meadow.',
    exampleVi: 'Chú thỏ nhỏ nhảy qua cánh đồng cỏ.',
  },
  moon: {
    word: 'moon',
    vi: 'mặt trăng',
    phonetic: '/muːn/',
    partOfSpeech: 'noun',
    exampleEn: 'The round moon smiled in the night sky.',
    exampleVi: 'Vầng trăng tròn mỉm cười trên bầu trời đêm.',
  },
  meadow: {
    word: 'meadow',
    vi: 'đồng cỏ xanh',
    phonetic: '/ˈmed.oʊ/',
    partOfSpeech: 'noun',
    exampleEn: 'Soft grass covered the wide meadow.',
    exampleVi: 'Cỏ mềm mại bao phủ cánh đồng rộng lớn.',
  },
  grass: {
    word: 'grass',
    vi: 'cỏ',
    phonetic: '/ɡræs/',
    partOfSpeech: 'noun',
    exampleEn: 'The morning dew was fresh on the green grass.',
    exampleVi: 'Sương sớm còn đọng lại trên cỏ xanh.',
  },
  ears: {
    word: 'ears',
    vi: 'đôi tai',
    phonetic: '/ɪərz/',
    partOfSpeech: 'noun',
    exampleEn: 'Mochi stretched his white ears high.',
    exampleVi: 'Mochi dựng đôi tai trắng lên thật cao.',
  },
  eyes: {
    word: 'eyes',
    vi: 'đôi mắt',
    phonetic: '/aɪz/',
    partOfSpeech: 'noun',
    exampleEn: 'Bright little eyes watched the stars.',
    exampleVi: 'Đôi mắt nhỏ sáng ngời ngắm nhìn các vì sao.',
  },
  evening: {
    word: 'evening',
    vi: 'buổi tối',
    phonetic: '/ˈiːv.nɪŋ/',
    partOfSpeech: 'noun',
    exampleEn: 'The evening air was calm and quiet.',
    exampleVi: 'Không khí buổi tối thật êm đềm và yên tĩnh.',
  },
  sun: {
    word: 'sun',
    vi: 'mặt trời',
    phonetic: '/sʌn/',
    partOfSpeech: 'noun',
    exampleEn: 'The golden sun went to sleep behind the hills.',
    exampleVi: 'Mặt trời vàng óng đi ngủ sau rặng đồi.',
  },
  tree: {
    word: 'tree',
    vi: 'cái cây',
    phonetic: '/triː/',
    partOfSpeech: 'noun',
    exampleEn: 'He sat beside the ancient oak tree.',
    exampleVi: 'Chú ngồi bên cạnh cây sồi cổ thụ.',
  },
  sky: {
    word: 'sky',
    vi: 'bầu trời',
    phonetic: '/skaɪ/',
    partOfSpeech: 'noun',
    exampleEn: 'Stars sparkled across the dark sky.',
    exampleVi: 'Những vì sao lấp lánh trên bầu trời đêm.',
  },
  whispered: {
    word: 'whispered',
    vi: 'thì thầm',
    phonetic: '/ˈwɪs.pɚd/',
    partOfSpeech: 'verb',
    exampleEn: 'Mochi whispered a bedtime secret.',
    exampleVi: 'Mochi thì thầm một điều bí mật trước khi ngủ.',
  },
  beautiful: {
    word: 'beautiful',
    vi: 'xinh đẹp',
    phonetic: '/ˈbjuː.tɪ.fəl/',
    partOfSpeech: 'adjective',
    exampleEn: 'The moonlight was magical and beautiful.',
    exampleVi: 'Ánh trăng thật kỳ diệu và xinh đẹp.',
  },
  brave: {
    word: 'brave',
    vi: 'dũng cảm',
    phonetic: '/breɪv/',
    partOfSpeech: 'adjective',
    exampleEn: 'He took a brave hop up the steep hill.',
    exampleVi: 'Chú dũng cảm nhảy lên ngọn đồi dốc.',
  },
  friends: {
    word: 'friends',
    vi: 'những người bạn',
    phonetic: '/frendz/',
    partOfSpeech: 'noun',
    exampleEn: 'They will be best friends forever.',
    exampleVi: 'Họ sẽ mãi là những người bạn thân thiết nhất.',
  },
  friend: {
    word: 'friend',
    vi: 'người bạn',
    phonetic: '/frend/',
    partOfSpeech: 'noun',
    exampleEn: 'The moon was a gentle friend.',
    exampleVi: 'Mặt trăng là một người bạn hiền dịu.',
  },
  silent: {
    word: 'silent',
    vi: 'yên lặng, tĩnh mịch',
    phonetic: '/ˈsaɪ.lənt/',
    partOfSpeech: 'adjective',
    exampleEn: 'The meadow grew silent and still.',
    exampleVi: 'Cánh đồng trở nên yên lặng và tĩnh lặng.',
  },
  magical: {
    word: 'magical',
    vi: 'kỳ diệu, phép màu',
    phonetic: '/ˈmædʒ.ɪ.kəl/',
    partOfSpeech: 'adjective',
    exampleEn: 'A magical glow touched the world.',
    exampleVi: 'Một luồng sáng kỳ diệu chạm vào vạn vật.',
  },
  lullaby: {
    word: 'lullaby',
    vi: 'bài hát ru, tiếng ru',
    phonetic: '/ˈlʌl.ə.baɪ/',
    partOfSpeech: 'noun',
    exampleEn: 'The soft wind sounded like a lullaby.',
    exampleVi: 'Cơn gió nhẹ nghe như một bài hát ru.',
  },
  shine: {
    word: 'shine',
    vi: 'tỏa sáng, chiếu sáng',
    phonetic: '/ʃaɪn/',
    partOfSpeech: 'verb',
    exampleEn: 'Stars shine all through the night.',
    exampleVi: 'Các vì sao chiếu sáng suốt cả đêm dài.',
  },
  burrow: {
    word: 'burrow',
    vi: 'hang thỏ',
    phonetic: '/ˈbɝː.oʊ/',
    partOfSpeech: 'noun',
    exampleEn: 'The warm burrow kept the little rabbit safe.',
    exampleVi: 'Cái hang ấm áp giữ cho chú thỏ an toàn.',
  },
  peacefully: {
    word: 'peacefully',
    vi: 'thanh bình, yên ả',
    phonetic: '/ˈpiːs.fəl.i/',
    partOfSpeech: 'adverb',
    exampleEn: 'Mochi rested peacefully till morning.',
    exampleVi: 'Mochi nghỉ ngơi yên ả cho đến sáng mai.',
  },
  goodnight: {
    word: 'goodnight',
    vi: 'chúc ngủ ngon',
    phonetic: '/ˌɡʊdˈnaɪt/',
    partOfSpeech: 'phrase',
    exampleEn: 'Goodnight and sweet dreams!',
    exampleVi: 'Chúc ngủ ngon và có những giấc mơ ngọt ngào!',
  },
  dreams: {
    word: 'dreams',
    vi: 'những giấc mơ',
    phonetic: '/driːmz/',
    partOfSpeech: 'noun',
    exampleEn: 'May your dreams be filled with starlight.',
    exampleVi: 'Chúc những giấc mơ của bạn ngập tràn ánh sao.',
  },
};

export function lookupWord(cleanWord: string): WordDefinition | null {
  const normalized = cleanWord.toLowerCase().replace(/[^a-z]/g, '');
  if (STORY_VOCABULARY[normalized]) {
    return STORY_VOCABULARY[normalized];
  }
  // Try singular
  if (normalized.endsWith('s') && STORY_VOCABULARY[normalized.slice(0, -1)]) {
    return STORY_VOCABULARY[normalized.slice(0, -1)];
  }
  // Try ed
  if (normalized.endsWith('ed') && STORY_VOCABULARY[normalized.slice(0, -2)]) {
    return STORY_VOCABULARY[normalized.slice(0, -2)];
  }
  return null;
}

