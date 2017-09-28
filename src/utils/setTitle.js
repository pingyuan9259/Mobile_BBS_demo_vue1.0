let title = {
  set (title) {
    let bridge = window.tinfiniteBridge

    if (bridge && bridge.updateTitle) {
      bridge.updateTitle(JSON.stringify({
        title: title
      }))
    }

    document.title = title
  }
}

export default title
