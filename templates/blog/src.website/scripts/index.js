function catchFetchError(response) {
  if (!response.ok) {
    alert(response.statusText);
    throw new Error(response.statusText);
  }
  return response;
}