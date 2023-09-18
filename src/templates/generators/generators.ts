// functions to generate segments
interface MetaTagOptions {
	description?: string;
	keywords?: string[];
	author?: string;
	ogTitle?: string;
	ogDescription?: string;
	ogImage?: string;
	ogUrl?: string;
	ogSiteName?: string;
	twitterCard?: string;
	twitterSite?: string;
	twitterTitle?: string;
	twitterDescription?: string;
	twitterImage?: string;
}

export function generateMetaTags(options: MetaTagOptions): string {
	return `
        <!-- Basic meta tags -->
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        
        ${options.description ? `<meta name="description" content="${options.description}">` : ''}
        ${options.keywords ? `<meta name="keywords" content="${options.keywords.join(', ')}">` : ''}
        ${options.author ? `<meta name="author" content="${options.author}">` : ''}
        
        <!-- Open Graph (OG) meta tags -->
        ${options.ogTitle ? `<meta property="og:title" content="${options.ogTitle}">` : ''}
        ${options.ogDescription ? `<meta property="og:description" content="${options.ogDescription}">` : ''}
        ${options.ogImage ? `<meta property="og:image" content="${options.ogImage}">` : ''}
        ${options.ogUrl ? `<meta property="og:url" content="${options.ogUrl}">` : ''}
        ${options.ogSiteName ? `<meta property="og:site_name" content="${options.ogSiteName}">` : ''}
        <meta property="og:type" content="website">
        
        <!-- Twitter specific tags (Optional but useful if you expect shares on Twitter) -->
        ${options.twitterCard ? `<meta name="twitter:card" content="${options.twitterCard}">` : ''}
        ${options.twitterSite ? `<meta name="twitter:site" content="${options.twitterSite}">` : ''}
        ${options.twitterTitle ? `<meta name="twitter:title" content="${options.twitterTitle}">` : ''}
        ${options.twitterDescription ? `<meta name="twitter:description" content="${options.twitterDescription}">` : ''}
        ${options.twitterImage ? `<meta name="twitter:image" content="${options.twitterImage}">` : ''}
    `;
}

export function generateCSS(): string {
	return `
	body {
		font-family: 'Arial', sans-serif;
		transition: background-color 1s ease;
		background-size: cover;
		background-image: url('https://imagedelivery.net/HML6qmlXDXx6EPV6zNm9VA/077e7d40-99f1-43a2-ec17-1b826021cc00/public'); /* This gives a nicer effect behind the frosted glass. You can add an image of your choice. */
		background-size: cover;
		background-position: center;
		background-repeat: no-repeat;
		height: 100vh;
	}
	
	.container {
		color: rgba(255, 255, 255, 0.8);
		position: relative;
		padding: 20px;
		border-radius: 20px;
		backdrop-filter: blur(10px); /* This provides the frosted glass effect */
		background-color: rgba(255, 229, 217, 0.3); /* A pastel tint */
		max-width: 80%;
		font-size: 25px;
		margin: 15% auto;
		text-align: center;
		transition: background-color 1s ease;
	}
	button {
		background-color: #007BFF;
		color: #fff;
		padding: 10px 15px;
		border: none;
		border-radius: 3px;
		cursor: pointer;
		margin-top: 20px;
	}
	
	button:hover {
		background-color: #0056b3;
	}
	
	#countdown {
		display: flex;
		justify-content: center;
		margin-top: 20px;
	}
	
	.countdown-dot {
		width: 10px;
		height: 10px;
		background-color: #888;
		border-radius: 50%;
		margin: 0 5px;
		opacity: 1;
		transition: opacity 1s ease;
	}
	.counterdiv {
		font-size:12px;
	}
	
	`;
}

export function generateBodyContent(count?: number): string {
	return `
	<div class="container">
	<h1></h1>
	<div id="quoteDisplay"></div>
	<div id="countdown"></div>
	 <svg   id="generateQuote" height="50" width="50" xmlns="http://www.w3.org/2000/svg" fill"white" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" >
	<path stroke-linecap="round" stroke-linejoin="round" d="M3 8.688c0-.864.933-1.405 1.683-.977l7.108 4.062a1.125 1.125 0 010 1.953l-7.108 4.062A1.125 1.125 0 013 16.81V8.688zM12.75 8.688c0-.864.933-1.405 1.683-.977l7.108 4.062a1.125 1.125 0 010 1.953l-7.108 4.062a1.125 1.125 0 01-1.683-.977V8.688z" />
  </svg>
  <div class="counterdiv"></div>
  
</div>
	`;
}

export function generateJavaScript(parsedData: string): string {
	return `
        document.addEventListener("DOMContentLoaded", function() {
            const quotes = ${parsedData};
            const quoteDisplay = document.getElementById("quoteDisplay");
            const generateQuoteBtn = document.getElementById("generateQuote");
            const countdown = document.getElementById("countdown");
            const quoteCountDisplay = document.querySelector(".container > div:last-child"); // Assuming the last div in the container displays the total quote count
            let countdownInterval;
            let backgroundColors = [
                'rgba(0, 0, 0, 0.8)', 'rgba(0, 0, 0, 0.9)'
            ];

            generateQuoteBtn.addEventListener("click", displayRandomQuote);

            function fetchQuoteCount() {
                fetch('/count')
                    .then(response => response.json())
                    .then(data => {
                        if (data && data.count !== undefined) {
                            quoteCountDisplay.textContent = "Total quotes served (global approximate): " + data.count;
                        }
                    })
                    .catch(error => console.error("Error fetching quote count:", error));
            }

            function displayRandomQuote() {
                clearInterval(countdownInterval); // Clear existing countdown
                
                const randomIndex = Math.floor(Math.random() * quotes.length);
                const randomBgIndex = Math.floor(Math.random() * backgroundColors.length);
                const complementaryBgIndex = (randomBgIndex + 3) % backgroundColors.length; // to get a contrast color

                document.body.style.backgroundColor = backgroundColors[randomBgIndex];
                quoteDisplay.textContent = quotes[randomIndex];
                quoteDisplay.parentNode.style.backgroundColor = backgroundColors[complementaryBgIndex];

                startCountdown();

                fetchQuoteCount(); // Fetch the updated count of quotes served every time a quote is displayed
            }

            function startCountdown() {
                const totalDots = 5;
                let dotIndex = 0;
            
                countdown.innerHTML = '';
                for (let i = 0; i < totalDots; i++) {
                    countdown.innerHTML += '<div class="countdown-dot" style="opacity:0;"></div>';
                }
            
                countdownInterval = setInterval(function() {
                    if (dotIndex < totalDots) {
                        countdown.children[dotIndex].style.opacity = 1;
                        dotIndex++;
                    } else {
                        clearInterval(countdownInterval);
                        displayRandomQuote();
                    }
                }, 1000);
            }
            
            setTimeout(displayRandomQuote, 500);
        });
    `;
}
