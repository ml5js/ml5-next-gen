export async function loadTransformersFromCDN() {
    // Check if already loaded
    if (window.loadTransformers) {
      return;
    }

    // Check if script already exists
    const existingScript = document.querySelector('script[data-transformers-loader="true"]');
    if (existingScript) {
      throw new Error('Transformers loader script exists but function not available');
    }

    // Create and inject the loader script with promise resolution
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.setAttribute('data-transformers-loader', 'true');
      script.type = 'module';
      
      // Store resolve/reject functions globally so the script can access them
      const promiseId = `transformersLoader_${Date.now()}`;
      window[`${promiseId}_resolve`] = resolve;
      window[`${promiseId}_reject`] = reject;
      
      // Inline the transformers loader code
      script.textContent = `
        (function() {
          let transformersPipeline = null;

          window.loadTransformers = async function() {
            if (transformersPipeline) {
              return transformersPipeline;
            }

            try {
              const module = await import("https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.0.0");
              transformersPipeline = module.pipeline;
              return transformersPipeline;
            } catch (error) {
              console.error("Failed to load transformers.js", error);
              throw error;
            }
          };

          // Resolve the promise now that the function is available
          try {
            window['${promiseId}_resolve']();
            // Clean up the global functions
            delete window['${promiseId}_resolve'];
            delete window['${promiseId}_reject'];
          } catch (error) {
            window['${promiseId}_reject'](error);
            delete window['${promiseId}_resolve'];
            delete window['${promiseId}_reject'];
          }
        })();
      `;
      
      // Handle script loading errors
      script.onerror = () => {
        reject(new Error('Failed to inject transformers loader script'));
        delete window[`${promiseId}_resolve`];
        delete window[`${promiseId}_reject`];
      };
      
      document.head.appendChild(script);
    });
  }