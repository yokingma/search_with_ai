const URL = 'http://127.0.0.1:3000/search'

export async function search(q: string) {
  const query = new URLSearchParams({
    q
  })
  const res = await fetch(`${URL}?${query.toString()}`, {
    method: 'GET',
  })
  return res.json()
}
