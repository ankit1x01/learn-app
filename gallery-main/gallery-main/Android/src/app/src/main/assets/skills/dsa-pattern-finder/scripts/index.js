window['ai_edge_gallery_get_result'] = async (data) => {
  try {
    const json = JSON.parse(data || '{}');
    const pattern = json.pattern || 'sliding_window';
    const params = new URLSearchParams({pattern});
    return JSON.stringify({
      webview: {url: `../assets/pattern.html?${params}`},
      result: `Here is the ${pattern.replace(/_/g, ' ')} pattern card with template and key insights. Tap to expand.`,
    });
  } catch (e) {
    return JSON.stringify({error: `Error: ${e.message}`});
  }
};
