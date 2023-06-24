export const transliterate = (text: string): string => {
  const cyrillicMap: { [key: string]: string } = {
    'а': 'a',
    'б': 'b',
    'в': 'v',
    'г': 'g',
    'д': 'd',
    'е': 'e',
    'ё': 'yo',
    'ж': 'zh',
    'з': 'z',
    'и': 'i',
    'й': 'y',
    'к': 'k',
    'л': 'l',
    'м': 'm',
    'н': 'n',
    'о': 'o',
    'п': 'p',
    'р': 'r',
    'с': 's',
    'т': 't',
    'у': 'u',
    'ф': 'f',
    'х': 'h',
    'ц': 'ts',
    'ч': 'ch',
    'ш': 'sh',
    'щ': 'sch',
    'ъ': '',
    'ы': 'y',
    'ь': '',
    'э': 'e',
    'ю': 'yu',
    'я': 'ya',
  }

  return text.replace(
    /[а-яё]/gi,
    mutch => cyrillicMap[mutch].toLocaleLowerCase() || '',
  )
}

export const codeGenerator = (title: string): string => {
  const code: string = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-') // Заменяем все не-буквенно-цифровые символы на дефисы
    .replace(/^-+|-+$/g, '')
  return transliterate(code)
}
