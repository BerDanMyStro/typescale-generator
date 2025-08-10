$(document).ready(function() {
    // DOM Elements
    const $baseFontSize = $('#baseFontSize');
    const $scaleFactor = $('#scaleFactor');
    const $customScale = $('#customScale');
    const $fontFamily = $('#fontFamily');
    const $previewElements = $('input[name="previewElements"]');
    const $unitToggle = $('#unitToggle');
    const $fluidToggle = $('#enableFluid');
    const $fluidControls = $('#fluidControls');
    const $minViewport = $('#minViewport');
    const $maxViewport = $('#maxViewport');
    const $typePreview = $('#preview');
    const $scssCode = $('#scssCode');
    const $copyButton = $('#copyCode');
    
    // Default values
    let baseFontSize = parseFloat($baseFontSize.val());
    let scaleFactor = parseFloat($scaleFactor.val());
    let selectedFont = $fontFamily.val();
    let useRem = false;
    let useFluid = false;
    let minViewport = parseFloat($minViewport.val());
    let maxViewport = parseFloat($maxViewport.val());
    
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
        $fluidToggle.on('change', toggleFluidType);
        $minViewport.on('input', updateFluidSettings);
        $maxViewport.on('input', updateFluidSettings);
        $copyButton.on('click', copyScssToClipboard);
        $fontFamily.on('change', updateFontFamily);
        
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
    
    // Toggle fluid typography
    function toggleFluidType() {
        useFluid = $(this).is(':checked');
        if (useFluid) {
            $fluidControls.removeClass('hidden');
        } else {
            $fluidControls.addClass('hidden');
        }
        updatePreview();
    }
    
    // Update fluid settings
    function updateFluidSettings() {
        minViewport = parseFloat($minViewport.val()) || 320;
        maxViewport = parseFloat($maxViewport.val()) || 1200;
        updatePreview();
    }
    
    // Update font family
    function updateFontFamily() {
        selectedFont = $(this).val();
        loadGoogleFont(selectedFont);
        updatePreview();
    }
    
    // Load Google Font dynamically
    function loadGoogleFont(fontName) {
        // Skip loading for system fonts
        if (fontName === 'Inter') return;
        
        // Format font name for Google Fonts URL
        const formattedFontName = fontName.replace(/\s+/g, '+');
        const fontUrl = `https://fonts.googleapis.com/css2?family=${formattedFontName}:wght@400;500;600;700&display=swap`;
        
        // Check if font is already loaded
        const existingLink = document.querySelector(`link[href*="${formattedFontName}"]`);
        if (existingLink) return;
        
        // Create and append link element
        const linkElement = document.createElement('link');
        linkElement.href = fontUrl;
        linkElement.rel = 'stylesheet';
        linkElement.type = 'text/css';
        document.head.appendChild(linkElement);
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
            
            // Calculate fluid sizes if enabled
            let fluidValue = null;
            if (useFluid) {
                // Create a proper fluid range: smaller size for min viewport, larger for max viewport
                const minSize = fontSize * 0.8;  // 20% smaller at min viewport
                const maxSize = fontSize * 1.1;  // 10% larger at max viewport
                
                // Calculate the fluid value using the CSS clamp formula
                fluidValue = calculateFluidValue(minSize, maxSize, minViewport, maxViewport);
            }
            
            scale[el] = {
                fontSize: fontSize,
                fluidValue: fluidValue,
                lineHeight: Math.ceil(fontSize * 1.2 / 8) * 8 / fontSize, // Round to nearest 8px
                marginBottom: Math.max(8, fontSize * 0.5) // At least 8px margin
            };
        });
        
        return { elements, scale };
    }
    
    // Calculate a fluid typography value using CSS clamp()
    function calculateFluidValue(minSize, maxSize, minVw, maxVw) {
        // Calculate the slope for the linear equation: y = mx + b
        // where m is the slope and b is the y-intercept
        const slope = (maxSize - minSize) / (maxVw - minVw);
        const yIntercept = minSize - (slope * minVw);
        
        // Format the preferred value as a calc() expression
        // calc([y-intercept] + [slope] * 100vw)
        const preferredValue = `${yIntercept.toFixed(3)}${useRem ? 'rem' : 'px'} + ${(slope * 100).toFixed(3)}vw`;
        
        // Format min and max sizes
        const minSizeValue = useRem ? (minSize / 16).toFixed(3) : Math.round(minSize);
        const maxSizeValue = useRem ? (maxSize / 16).toFixed(3) : Math.round(maxSize);
        
        // Return the CSS clamp expression
        return `clamp(${minSizeValue}${useRem ? 'rem' : 'px'}, calc(${preferredValue}), ${maxSizeValue}${useRem ? 'rem' : 'px'})`;
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
            
            // Get the font size value for styling
            let fontSizeValue;
            let fontSizeLabel;
            
            if (useFluid && size.fluidValue) {
                fontSizeValue = size.fluidValue;
                fontSizeLabel = `${el} · fluid (${fontSize}${unit}) · ${lineHeight} · ${marginBottom}px`;
            } else {
                fontSizeValue = `${fontSize}${unit}`;
                fontSizeLabel = `${el} · ${fontSize}${unit} · ${lineHeight} · ${marginBottom}px`;
            }
            
            // Create preview item
            previewHtml += `
                <div class="preview-item">
                    <span class="label">${fontSizeLabel}</span>
                    <${el} style="font-size: ${fontSizeValue}; line-height: ${lineHeight}; margin-bottom: ${marginBottom}px; font-family: ${selectedFont};">
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
        scss += `$scale-factor: ${scaleFactor.toFixed(3)};\n`;
        
        // Font family
        scss += `$font-family: ${selectedFont};\n`;
        
        // Add fluid typography variables if enabled
        if (useFluid) {
            scss += `$min-viewport-width: ${minViewport}px;\n`;
            scss += `$max-viewport-width: ${maxViewport}px;\n`;
        }
        
        scss += '\n';
        
        // Type scale map
        scss += '// Type Scale Map\n';
        scss += '$type-scale: (\n';
        
        // Add each element to the scale map
        Object.entries(scale).forEach(([element, values]) => {
            if (useFluid && values.fluidValue) {
                // Use fluid value directly since it's already a complete CSS expression
                scss += `  ${element}: ${values.fluidValue},\n`;
            } else {
                // Use static size
                const size = useRem 
                    ? (values.fontSize / 16).toFixed(3) 
                    : Math.round(values.fontSize);
                scss += `  ${element}: ${size}${unit},\n`;
            }
        });
        
        // Close the map
        scss += `);\n\n`;
        
        // Add usage examples
        scss += '// Usage Examples:\n';
        scss += '// h1 { font-size: map-get($type-scale, h1); }\n';
        
        // Add mixin for fluid typography if enabled
        if (useFluid) {
            scss += '\n// Fluid Typography Mixin\n';
            scss += '@mixin fluid-type($min-size, $max-size, $min-vw: $min-viewport-width, $max-vw: $max-viewport-width) {\n';
            scss += '  $slope: ($max-size - $min-size) / ($max-vw - $min-vw);\n';
            scss += '  $y-intercept: $min-size - $slope * $min-vw;\n';
            scss += '  font-size: clamp(#{$min-size}, #{$y-intercept} + #{$slope * 100}vw, #{$max-size});\n';
            scss += '}\n\n';
            scss += '// Example:\n';
            scss += '// h2 {\n';
            scss += '//   @include fluid-type(1.5rem, 2.5rem);\n';
            scss += '// }\n';
        }
        
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
