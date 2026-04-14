window['ai_edge_gallery_get_result'] = async (data) => {
  try {
    const json = JSON.parse(data || '{}');
    const category = json.category || 'all';
    const params = new URLSearchParams({cat: category});
    return JSON.stringify({
      webview: {url: `../assets/complexity.html?${params}`},
      result: `Here is the Big O complexity reference for ${category === 'all' ? 'all categories' : category}. Tap the card to open the full cheat sheet.`,
    });
  } catch (e) {
    return JSON.stringify({error: `Error: ${e.message}`});
  }
};
