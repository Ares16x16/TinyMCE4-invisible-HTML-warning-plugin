# TinyMCE Character Count & HTML Warning Plugin
A TinyMCE plugin that enhances the editor with a character counter and warnings about invisible HTML elements that may remain when content appears to be empty.

## Features
- Displays character count in the editor's status bar
- Detects and warns about invisible/empty HTML elements
Works with TinyMCE 4

## Screenshot
![image](https://github.com/user-attachments/assets/53cb8fba-44c2-4196-9479-66fd4deab245)

In source code:
![image](https://github.com/user-attachments/assets/f3f72d14-b946-4f6d-a997-484132d4fcb1)


## Installation
1. Add the plugin JavaScript file
Place the tinymce-charcount-plugin.js file in your web application's JavaScript directory, typically:
`src/main/webapp/js/tinymce-charcount-plugin.js`

2. Register the plugin with TinyMCE in your Java code
If you're using Wicket with TinyMCE4, extend the TinyMCESettings class and add the plugin:
```java
import wicket.contrib.tinymce4.settings.TinyMCESettings;

public class CustomTinyMceSettings extends TinyMCESettings {
    
    public CustomTinyMceSettings() {
        super(TinyMCESettings.Theme.modern);
        
        // Other config

        ServletContext context = WicketApplication.get().getServletContext();
        addCustomSetting("external_plugins: {'charcountwarn': '" + context.getContextPath() + "/js/tinymce-charcount-plugin.js'}");
        addPlugins("charcountwarn");
    }
}
```
3. Use your custom settings class with TinyMCE components
```java
CustomTinyMceSettings tinyMceSettings = new CustomTinyMceSettings();

TextArea<String> textArea = new TextArea<>("content");
textArea.add(new TinyMceBehavior(tinyMceSettings));
```

### How it works
The plugin monitors the editor's content and detects:

- Total character count (both text and HTML)
- Empty elements like <h> </h> or <p><br / ></p> that appear invisible to users
- When content appears empty but contains hidden HTML elements
- When empty elements are detected, the plugin displays a warning and suggests using the HTML view (code button) to properly clear the content.
