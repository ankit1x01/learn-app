window['ai_edge_gallery_get_result'] = async (data) => {
  try {
    const json = JSON.parse(data || '{}');
    const algorithm = json.algorithm || 'bubble_sort';
    let arr = json.array;
    const target = json.target;

    if (!arr || arr.length === 0) {
      arr = Array.from({length: 10}, () => Math.floor(Math.random() * 99) + 1);
    }
    arr = arr.slice(0, 12);

    const params = new URLSearchParams({
      algo: algorithm,
      arr: arr.join(','),
      ...(target !== undefined && {target: String(target)}),
    });

    return JSON.stringify({
      webview: {url: `../assets/visualizer.html?${params}`},
      result: `Here is the ${algorithm.replace(/_/g, ' ')} animation. Tap the card to watch the step-by-step visualization!`,
    });
  } catch (e) {
    return JSON.stringify({error: `Visualizer error: ${e.message}`});
  }
};
