export const getIntRandom = (min: number, max: number): number => {
  min = Math.ceil(min) // Округляем вниз до ближайшего целого числа
  max = Math.floor(max) // Округляем вверх до ближайшего целого числа
  return Math.floor(Math.random() * (max - min + 1)) + min
}
