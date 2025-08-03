$(document).ready(function() {
    // DOM Elements
    const $baseFontSize = $('#baseFontSize');
    const $scaleFactor = $('#scaleFactor');
    const $customScale = $('#customScale');
    const $previewElements = $('input[name="previewElements"]');
    const $unitToggle = $('#unitToggle');
    const $typePreview = $('#typePreview');
    const $scssCode = $('#scssCode');
    const $copyButton = $('#copyScss');
    
    // Default values
    let baseFontSize = parseFloat($baseFontSize.val());
    let scaleFactor = parseFloat($scaleFactor.val());
    let useRem = false;
    
    // Update scale when base font size changes
    function updateScale() {
        updatePreview();
    }
    
    // Initialize the app
    function init() {
        // Set up event listeners
        $baseFontSize.on('input', updateScale);
        $scaleFactor.on('change', handleScaleFactorChange);
        $customScale.on('input', updateCustomScale);
        $previewElements.on('change', updatePreview);
        $unitToggle.on('change', toggleUnit);
        $copyButton.on('click', copyScssToClipboard);
        
        // Initial render
        updatePreview();
    }
    
    // Handle scale factor change
    function handleScaleFactorChange() {
        if ($(this).val() === 'custom') {
            $customScale.removeClass('hidden');
            scaleFactor = parseFloat($customScale.val()) || 1.2;
        } else {
            $customScale.addClass('hidden');
            scaleFactor = parseFloat($(this).val());
        }
        updatePreview();
    }
    
    // Update custom scale value
    function updateCustomScale() {
        if ($scaleFactor.val() === 'custom') {
            scaleFactor = parseFloat($(this).val()) || 1.2;
            updatePreview();
        }
    }
    
    // Toggle between px and rem units
    function toggleUnit() {
        useRem = $(this).is(':checked');
        updatePreview();
    }
    
    // Calculate the type scale
    function calculateScale() {
        baseFontSize = parseFloat($baseFontSize.val()) || 16;
        
        // Get selected elements
        const elements = [];
        $previewElements.each(function() {
            if ($(this).is(':checked')) {
                elements.push($(this).val());
            }
        });
        
        // Calculate font sizes for each element
        const scale = {};
        elements.forEach((el, index) => {
            const steps = getStepsForElement(el);
            const fontSize = baseFontSize * Math.pow(scaleFactor, steps);
            scale[el] = {
                fontSize: fontSize,
                lineHeight: Math.ceil(fontSize * 1.2 / 8) * 8 / fontSize, // Round to nearest 8px
                marginBottom: Math.max(8, fontSize * 0.5) // At least 8px margin
            };
        });
        
        return { elements, scale };
    }
    
    // Get scale steps for each element type
    function getStepsForElement(element) {
        const elementSteps = {
            'h1': 4,
            'h2': 3,
            'h3': 2,
            'h4': 1,
            'h5': 0,
            'h6': -0.5,
            'p': 0,
            'small': -0.5
        };
        return elementSteps[element] || 0;
    }
    
    // Update the preview with new styles
    function updatePreview() {
        const { elements, scale } = calculateScale();
        let previewHtml = '';
        
        // Generate preview HTML for each element
        elements.forEach(el => {
            const size = scale[el];
            const unit = useRem ? 'rem' : 'px';
            const fontSize = useRem ? (size.fontSize / 16).toFixed(3) : Math.round(size.fontSize);
            const lineHeight = size.lineHeight.toFixed(2);
            const marginBottom = Math.round(size.marginBottom);
            
            // Create preview item
            previewHtml += `
                <div class="preview-item">
                    <span class="label">${el} · ${fontSize}${unit} · ${lineHeight} · ${marginBottom}px</span>
                    <${el} class="preview-content" style="font-size: ${fontSize}${unit}; line-height: ${lineHeight}; margin-bottom: ${marginBottom}px;">
                        ${getSampleText(el)}
                    </${el}>
                </div>
            `;
        });
        
        // Update the DOM
        $typePreview.html(previewHtml);
        
        // Update SCSS code
        updateScssCode(scale);
    }
    
    // Get sample text for each element type
    function getSampleText(element) {
        const samples = {
            'h1': 'The quick brown fox jumps over the lazy dog',
            'h2': 'The quick brown fox jumps over the lazy dog',
            'h3': 'The quick brown fox jumps over the lazy dog',
            'h4': 'The quick brown fox jumps over the lazy dog',
            'h5': 'The quick brown fox jumps over the lazy dog',
            'h6': 'The quick brown fox jumps over the lazy dog',
            'p': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris. Vivamus hendrerit arcu sed erat molestie vehicula. Sed auctor neque eu tellus rhoncus ut eleifend nibh porttitor.',
            'small': 'This is some small text for captions, footnotes, or secondary information.'
        };
        return samples[element] || 'Sample text';
    }
    
    // Update the SCSS code block
    function updateScssCode(scale) {
        let scss = '// Type Scale Variables\n';
        const unit = useRem ? 'rem' : 'px';
        
        // Base font size
        const baseSize = useRem ? (baseFontSize / 16).toFixed(3) : Math.round(baseFontSize);
        scss += `$base-font-size: ${baseSize}${unit};\n`;
        
        // Scale factor
        scss += `$scale-factor: ${scaleFactor.toFixed(3)};\n\n`;
        
        // Type scale map
        scss += '// Type Scale Map\n';
        scss += '$type-scale: (\n';
        
        // Add each element to the scale map
        Object.entries(scale).forEach(([element, values]) => {
            const size = useRem 
                ? (values.fontSize / 16).toFixed(3) 
                : Math.round(values.fontSize);
            scss += `  ${element}: ${size}${unit},\n`;
        });
        
        // Close the map and add usage example
        scss += `);\n\n`;
        scss += '// Usage Example:\n';
        scss += '// h1 { font-size: map-get($type-scale, h1); }';
        
        // Update the code block
        $scssCode.text(scss);
        
        // Update syntax highlighting
        Prism.highlightElement($scssCode[0]);
    }
    
    // Copy SCSS code to clipboard
    function copyScssToClipboard() {
        const code = $scssCode.text();
        navigator.clipboard.writeText(code).then(() => {
            // Show success feedback
            const $button = $(this);
            const originalText = $button.text();
            $button.text('Copied!');
            
            // Reset button text after 2 seconds
            setTimeout(() => {
                $button.text(originalText);
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy text: ', err);
        });
    }
    
    // Initialize the app
    init();
});
