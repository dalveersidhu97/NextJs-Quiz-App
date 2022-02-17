export async function sendHttpRequest(url) {
  let error = null;
  let data;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Something went wrong!");
    data = await response.json();
  } catch (e) {
    error = e.message;
  }

  return { data, error };
}
