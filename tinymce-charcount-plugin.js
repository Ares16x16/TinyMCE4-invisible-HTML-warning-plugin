// TinyMCE Character Count & Invisible Element Warning Plugin
(function() {
    tinymce.PluginManager.add('charcountwarn', function(editor) {
        var statusbarNode = null;
        function updateStatusbar(text) {
            // Try to find the status bar in the DOM if not already found
            if (!statusbarNode) {
                var editorContainer = editor.getContainer();
                if (editorContainer) {
                    var statusbars = editorContainer.getElementsByClassName('mce-statusbar');
                    if (statusbars.length > 0) {
                        var wordcountLabel = statusbars[0].querySelector('.mce-wordcount');
                        statusbarNode = document.createElement('div');
                        statusbarNode.className = 'mce-charcountwarn';
                        //statusbarNode.style.marginLeft = '5px';
                        statusbarNode.style.fontWeight = 'bold';
                        statusbarNode.style.color = 'rgb(0, 0, 0)';
                        statusbarNode.style.borderRadius = '0px';
                        statusbarNode.style.padding = '0px 7px';
                        statusbarNode.style.fontSize = '14px';
                        statusbarNode.style.fontFamily = '"Segoe UI", Arial, sans-serif';
                        statusbarNode.style.letterSpacing = '0.2px';
                        statusbarNode.style.display = 'inline-block';
                        if (wordcountLabel && wordcountLabel.nextSibling) {
                            statusbars[0].insertBefore(statusbarNode, wordcountLabel.nextSibling);
                        } else {
                            statusbars[0].appendChild(statusbarNode);
                        }
                    }
                }
            }
            if (statusbarNode) {
                // Split text into main and warning parts
                var parts = text.split('[[WARN]]');
                var mainText = parts[0];
                var warningText = parts[1];
                
                // Clear previous content
                statusbarNode.innerHTML = '';
                
                // main counter text 
                var counterSpan = document.createElement('div');
                counterSpan.style.marginBottom = warningText ? '2px' : '0';
                counterSpan.style.fontWeight = 'bold';
                counterSpan.style.fontSize = '14px';
                counterSpan.style.lineHeight = '1';
                counterSpan.style.paddingLeft = '4px';
                counterSpan.textContent = mainText;
                statusbarNode.appendChild(counterSpan);
                
                // warning text
                if (warningText) {
                    var warningSpan = document.createElement('div');
                    warningSpan.style.fontWeight = 'bold';
                    warningSpan.style.color = 'rgb(204,0,0)';
                    warningSpan.style.fontSize = '14px';
                    warningSpan.style.fontFamily = '"Segoe UI", Arial, sans-serif';
                    warningSpan.style.letterSpacing = '0.2px';
                    warningSpan.style.display = 'flex';
                    warningSpan.style.alignItems = 'center';
                    warningSpan.style.lineHeight = '1.5';
                    warningSpan.innerHTML = '<span style="margin-right: 6px;">⚠️</span> There ' + (warningText.includes('1 HTML element') ? 'is 1 HTML element' : 'are ' + warningText.match(/\d+/)[0] + ' HTML elements') + ' remaining. If you wish to clear the content, please use <span style="display: inline-flex; align-items: center;">&nbsp;<i class="mce-ico mce-i-code" style="vertical-align: middle; position: relative; top: 2px;"></i>&nbsp;</span> to clear the HTML element' + (warningText.includes('1 HTML element') ? '' : 's') + '.';
                    statusbarNode.appendChild(warningSpan);
                }
            }
        }
        function updateCharacterCount() {
            var textContent = editor.getContent({format: 'text'});
            var htmlContent = editor.getContent({format: 'html'});
            var trimmedText = textContent.trim();
            var charCount = trimmedText.length;
            var htmlCharCount = htmlContent.length;
            var displayText = charCount + ' character' + (charCount === 1 || charCount === 0 ? '' : 's') + ' | ' + 
                              htmlCharCount + ' HTML character' + (htmlCharCount === 1 || htmlCharCount === 0 ? '' : 's');
            var invisibleElements = [];
            var emptyTagsCount = 0;
            var brTagsCount = 0;
            var emptyTagPatterns = [
                /<p[^>]*>\s*(?:&nbsp;|<br\s*\/?>[\s\n]*)*\s*<\/p>/gi,
                /<h[1-6][^>]*>\s*(?:&nbsp;|<br\s*\/?>[\s\n]*)*\s*<\/h[1-6]>/gi,
                /<div[^>]*>\s*(?:&nbsp;|<br\s*\/?>[\s\n]*)*\s*<\/div>/gi,
                /<span[^>]*>\s*(?:&nbsp;|<br\s*\/?>[\s\n]*)*\s*<\/span>/gi,
                /<li[^>]*>\s*(?:&nbsp;|<br\s*\/?>[\s\n]*)*\s*<\/li>/gi,
                /<pre[^>]*>\s*(?:&nbsp;|<br\s*\/?>[\s\n]*)*\s*<\/pre>/gi,
                /<blockquote[^>]*>\s*(?:&nbsp;|<br\s*\/?>[\s\n]*)*\s*<\/blockquote>/gi,
                /<td[^>]*>\s*(?:&nbsp;|<br\s*\/?>[\s\n]*)*\s*<\/td>/gi,
                /<th[^>]*>\s*(?:&nbsp;|<br\s*\/?>[\s\n]*)*\s*<\/th>/gi,
                /<a[^>]*>\s*(?:&nbsp;|<br\s*\/?>[\s\n]*)*\s*<\/a>/gi,
                /<strong[^>]*>\s*(?:&nbsp;|<br\s*\/?>[\s\n]*)*\s*<\/strong>/gi,
                /<em[^>]*>\s*(?:&nbsp;|<br\s*\/?>[\s\n]*)*\s*<\/em>/gi,
                /<b[^>]*>\s*(?:&nbsp;|<br\s*\/?>[\s\n]*)*\s*<\/b>/gi,
                /<i[^>]*>\s*(?:&nbsp;|<br\s*\/?>[\s\n]*)*\s*<\/i>/gi,
                /<u[^>]*>\s*(?:&nbsp;|<br\s*\/?>[\s\n]*)*\s*<\/u>/gi
            ];
            var isEmpty = trimmedText === '';
            var brTagsPattern = /<br\s*\/?>/gi;
            var brMatches = htmlContent.match(brTagsPattern) || [];
            brTagsCount = brMatches.length;
            var contentWithoutBrTags = htmlContent.replace(brTagsPattern, '').replace(/<\/?[^>]+(>|$)/g, '').trim();
            var onlyBrTags = isEmpty && brTagsCount > 0 && contentWithoutBrTags === '';
            for (var i = 0; i < emptyTagPatterns.length; i++) {
                var pattern = emptyTagPatterns[i];
                var matches = htmlContent.match(pattern);
                if (matches && matches.length > 0) {
                    emptyTagsCount += matches.length;
                    for (var j = 0; j < matches.length; j++) {
                        var match = matches[j];
                        var tagMatch = match.match(/<(\w+)[^>]*>/);
                        if (tagMatch && tagMatch[1]) {
                            invisibleElements.push('<' + tagMatch[1] + '>');
                        }
                    }
                }
            }
            if (emptyTagsCount > 0 || onlyBrTags) {
                var elementCount = emptyTagsCount + (onlyBrTags ? brTagsCount : 0);
                displayText += '[[WARN]]⚠️ There ' + (elementCount === 1 ? 'is 1 HTML element' : 'are ' + elementCount + ' HTML elements') + ' remaining. If you wish to clear the content, please use <i class="mce-ico mce-i-code" style="vertical-align: middle; position: relative; top: 2px;"></i> to clear the HTML element' + (elementCount > 1 ? 's' : '') + '.';
            }
            updateStatusbar(displayText);
        }
        editor.on('init', function() {
            setTimeout(updateCharacterCount, 300);
        });
        editor.on('KeyUp', updateCharacterCount);
        editor.on('Change', updateCharacterCount);
        editor.on('NodeChange', updateCharacterCount);
        editor.on('SetContent', updateCharacterCount);
    });
})();
