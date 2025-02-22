document.addEventListener('DOMContentLoaded', function() {
    const tabList = document.getElementById('tabList');
    const copyBtn = document.getElementById('copyBtn');
    const saveBtn = document.getElementById('saveBtn');
  
    // Query all tabs in the current window.
    chrome.tabs.query({ currentWindow: true }, function(tabs) {
      // Populate the popup with a list of tabs.
      tabs.forEach(function(tab) {
        const div = document.createElement('div');
        div.className = 'tab-item';
        
        // Create an image element for the favicon.
        const img = document.createElement('img');
        img.src = tab.favIconUrl || 'default_icon.png';
        // Hide image if not available.
        img.onerror = function() {
          this.style.display = 'none';
        };
        div.appendChild(img);
        
        // Create a link with the tab's title.
        const link = document.createElement('a');
        link.href = tab.url;
        link.textContent = tab.title || tab.url;
        link.target = '_blank';
        div.appendChild(link);
  
        tabList.appendChild(div);
      });
  
      // Functionality to copy all tab URLs to the clipboard.
      copyBtn.addEventListener('click', function() {
        const urls = tabs.map(tab => tab.url).join('\n');
        navigator.clipboard.writeText(urls).then(function() {
          alert('Tab URLs copied to clipboard.');
        }, function(err) {
          alert('Failed to copy text: ' + err);
        });
      });
  
      // Functionality to save the tab details as an HTML file.
      saveBtn.addEventListener('click', function() {
        const htmlContent = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <title>Saved Tabs</title>
    <style>
      body { font-family: Arial, sans-serif; }
      .tab-item { display: flex; align-items: center; margin-bottom: 5px; }
      .tab-item img { width: 16px; height: 16px; margin-right: 5px; }
      .tab-item a { text-decoration: none; color: #000; }
    </style>
  </head>
  <body>
    <h2>Saved Tabs</h2>
    ${tabs.map(tab => {
      const icon = tab.favIconUrl || 'default_icon.png';
      const title = tab.title || tab.url;
      return `<div class="tab-item">
                <img src="${icon}" alt="icon" onerror="this.style.display='none'">
                <a href="${tab.url}" target="_blank">${title}</a>
              </div>`;
    }).join('')}
  </body>
  </html>
        `;
        // Create a blob and initiate a download.
        const blob = new Blob([htmlContent], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'saved_tabs.html';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      });
    });
  });
  