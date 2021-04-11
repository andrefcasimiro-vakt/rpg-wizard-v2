export const includesHash = (hashParameter: string) => {
  return location.hash.split('&')[0]?.includes(hashParameter)
}
