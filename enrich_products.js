const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

const envContent = fs.readFileSync('D:/clon vs mode/web-petshop/.env.local', 'utf-8');
const url = envContent.split('\n').find(l => l.startsWith('NEXT_PUBLIC_SUPABASE_URL=')).split('=')[1].trim();
const key = envContent.split('\n').find(l => l.startsWith('NEXT_PUBLIC_SUPABASE_ANON_KEY=')).split('=')[1].trim();
const geminiKey = "AQ.Ab8RN6Kofq7zXb8fGvQaaYOQeUOvwpnhlOyX-buZkX-ZHh4B-Q";

const supabase = createClient(url, key);

async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function callGemini(products) {
  const prompt = `Eres un experto en nutrición de mascotas y marketing. 
Por favor, escribe una descripción corta, atractiva y comercial (máximo 2-3 líneas) para cada uno de los siguientes productos.
Incluye algún emoji relevante (🐾, 🥩, 🐟, etc.) y menciona el beneficio principal o ingrediente clave basándote en el nombre y la marca.
Responde ÚNICAMENTE con un array en formato JSON válido, donde cada objeto tenga 'id' (el id exacto que te doy) y 'desc' (la descripción generada). No uses bloques de código markdown, solo el texto JSON puro.

Productos:
${JSON.stringify(products.map(p => ({ id: p.id, nombre: p.nombre, marca: p.marca, categoria: p.categoria_web || p.familia })), null, 2)}
`;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.7, response_mime_type: "application/json" }
      })
    });
    
    if (!response.ok) {
      console.error('Gemini error:', response.status, await response.text());
      return null;
    }
    const result = await response.json();
    const text = result.candidates[0].content.parts[0].text;
    return JSON.parse(text);
  } catch (err) {
    console.error('Error parsing gemini response:', err);
    return null;
  }
}

async function main() {
  console.log('Fetching products...');
  let allProducts = [];
  let page = 0;
  while(true) {
    const { data, error } = await supabase.from('productos')
      .select('id, nombre, marca, familia')
      .is('caracteristicas', null)
      .limit(100)
      .range(page*100, (page+1)*100 - 1);
      
    if (error) { console.error('Error fetching', error); break; }
    if (data.length === 0) break;
    allProducts.push(...data);
    page++;
  }
  
  console.log(`Found ${allProducts.length} products to update.`);
  
  // Process in chunks of 15
  const chunkSize = 15;
  let updatedCount = 0;
  
  for (let i = 0; i < allProducts.length; i += chunkSize) {
    const chunk = allProducts.slice(i, i + chunkSize);
    console.log(`Processing chunk ${Math.floor(i/chunkSize) + 1} of ${Math.ceil(allProducts.length/chunkSize)}...`);
    
    const geminiData = await callGemini(chunk);
    if (geminiData && Array.isArray(geminiData)) {
      for (const item of geminiData) {
        if (!item.id || !item.desc) continue;
        const { error } = await supabase.from('productos')
          .update({ caracteristicas: item.desc })
          .eq('id', item.id);
        if (error) console.error(`Failed to update ${item.id}:`, error);
        else updatedCount++;
      }
    } else {
        console.log("No valid JSON returned from Gemini for this chunk.");
    }
    
    // delay to avoid rate limit (15 req/min = 1 req / 4 sec)
    await delay(4000);
  }
  
  console.log(`Finished! Updated ${updatedCount} products.`);
}

main();
