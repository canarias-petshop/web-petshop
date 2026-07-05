async function check() {
  const res = await fetch('https://generativelanguage.googleapis.com/v1beta/models?key=AQ.Ab8RN6Kofq7zXb8fGvQaaYOQeUOvwpnhlOyX-buZkX-ZHh4B-Q');
  const data = await res.json();
  console.log(data.models.map(m => m.name).join(', '));
}
check();
