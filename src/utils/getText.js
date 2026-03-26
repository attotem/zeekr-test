export const getTextByLang = (textObj, lang) => {
  if (!textObj) return '';
  if (typeof textObj === 'string') return textObj;
  if (typeof textObj !== 'object') return '';

  const activeLang = lang || 'en';

  if (textObj[activeLang]) return textObj[activeLang];

  if (activeLang === 'uk' && textObj.ua) return textObj.ua;
  if (activeLang === 'ua' && textObj.uk) return textObj.uk;

  if (activeLang === 'zh' && (textObj.zh || textObj.cn)) return textObj.zh || textObj.cn;
  if (activeLang === 'cn' && (textObj.cn || textObj.zh)) return textObj.cn || textObj.zh;

  return (
    textObj.uk ||
    textObj.ua ||
    textObj.en ||
    textObj.ru ||
    textObj.zh ||
    textObj.cn ||
    ''
  );
};

