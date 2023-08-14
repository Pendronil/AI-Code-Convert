import { CodeBlock } from '@/components/CodeBlock';
import { LanguageSelect,languages } from '@/components/LanguageSelect';
import { TextBlock } from '@/components/TextBlock';
import { TranslateBody } from '@/types/types';
import Head from 'next/head';
import { useEffect, useState } from 'react';

export default function Home() {
  const [title, setTitle] = useState('Code Generator');
  const [subtitle, setSubtitle] = useState('Generate Code From Natural Language To Programming Language Code');
  const [inputLanguage, setInputLanguage] = useState<string>('Natural Language');
  const [outputLanguage, setOutputLanguage] = useState<string>('Python');
  const [inputCode, setInputCode] = useState<string>('');
  const [outputCode, setOutputCode] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [hasTranslated, setHasTranslated] = useState<boolean>(false);

  const handleTranslate = async () => {
    const maxCodeLength = 30000;

    if (inputLanguage === outputLanguage) {
      alert('Please select different languages.');
      return;
    }

    if (!inputCode) {
      alert('Please enter some code.');
      return;
    }

    if (inputCode.length > maxCodeLength) {
      alert(
        `Please enter code less than ${maxCodeLength} characters. You are currently at ${inputCode.length} characters.`,
      );
      return;
    }

    setLoading(true);
    setOutputCode('');

    const controller = new AbortController();

    const body: TranslateBody = {
      inputLanguage,
      outputLanguage,
      inputCode
    };

    const response = await fetch('/api/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      setLoading(false);
      alert('Please try again later.');
      return;
    }

    const data = response.body;

    if (!data) {
      setLoading(false);
      alert('Something went wrong.');
      return;
    }

    const reader = data.getReader();
    const decoder = new TextDecoder();
    let done = false;
    let code = '';

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value);

      code += chunkValue;

      setOutputCode((prevCode) => prevCode + chunkValue);
    }

    setLoading(false);
    setHasTranslated(true);
    copyToClipboard(code);
  };

  const copyToClipboard = (text: string) => {
    const el = document.createElement('textarea');
    el.value = text;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
  };

  useEffect(() => {
	  const isOutputLanguageInArray = languages.some(
	      (language) => language.value === outputLanguage
	  );
      if (hasTranslated && isOutputLanguageInArray) {
        handleTranslate();
      }
  }, [outputLanguage]);

  return (
    <>
      <Head>
        <title>AI Code Generator</title>
        <meta name="description" content="Use AI To Generate Code From Natural Language."/>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
		<meta name="keywords" content="AI Code Generator,Code Generate" />
		<link rel="canonical" href="https://aicodeconvert.com/generate-code/ai-code-generator" />
        <link rel="icon" href="/code.png" />
		{/* Add the Google Analytics script tags here */}
		<script async src="https://www.googletagmanager.com/gtag/js?id=G-Q03Q3VY7RV"></script>
		<script
		  dangerouslySetInnerHTML={{
			__html: `
			  window.dataLayer = window.dataLayer || [];
			  function gtag(){dataLayer.push(arguments);}
			  gtag('js', new Date());
			  gtag('config', 'G-Q03Q3VY7RV');
			`,
		  }}
		/>
		{/* baidu analytics */}
		<script src="/baidu-analytics.js" />
		<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3672455877501055"
		     crossOrigin="anonymous"></script>
      </Head>
	  <div className="h-100 flex justify-between items-center pl-2 pr-2 md:pl-10 md:pr-10 pt-2 bg-[#0E1117]">
	      <div className="flex items-center">
	          <svg width="40" height="40" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
	              <path fill="#3b82f6" d="M516 673c0 4.4 3.4 8 7.5 8h185c4.1 0 7.5-3.6 7.5-8v-48c0-4.4-3.4-8-7.5-8h-185c-4.1 0-7.5 3.6-7.5 8v48zm-194.9 6.1l192-161c3.8-3.2 3.8-9.1 0-12.3l-192-160.9A7.95 7.95 0 0 0 308 351v62.7c0 2.4 1 4.6 2.9 6.1L420.7 512l-109.8 92.2a8.1 8.1 0 0 0-2.9 6.1V673c0 6.8 7.9 10.5 13.1 6.1zM880 112H144c-17.7 0-32 14.3-32 32v736c0 17.7 14.3 32 32 32h736c17.7 0 32-14.3 32-32V144c0-17.7-14.3-32-32-32zm-40 728H184V184h656v656z"/>
	          </svg>
	          <h1 className="text-white font-bold text-2xl ml-1">
	              <a href="https://aicodeconvert.com">AICodeConvert.com</a>
	          </h1>
	      </div>
	      <div className="flex items-center hidden md:block lg:block">
			  <a href="https://blog.aicodeconvert.com" className="text-blue-500 text font-semibold mr-1 md:mr-4 lg:mr-4">Blog</a>
	          <a href="#about" className="text-white text font-semibold mr-1 md:mr-4 lg:mr-4">About Us</a>
	          <a href="#contact" className="text-white text font-semibold mr-1 md:mr-4 lg:mr-4">Contact</a>
	      </div>
	  </div>
	  
      <div className="flex h-full min-h-screen flex-col items-center bg-[#0E1117] px-4 pb-20 text-neutral-200 sm:px-10">
		<div className="mt-2 flex flex-col items-center justify-center sm:mt-10">
          <h2 className="text-3xl md:text-4xl font-bold"><span className="text-blue-500">AI</span> {title}</h2>
		  <h3 className="mt-2 md:mt-5 text-xl text-center leading-2">{subtitle}</h3>
        </div>
		
        <div className="mt-6 flex w-full max-w-[1600px] flex-col justify-between sm:flex-row sm:space-x-4">
          <div className="h-100 flex flex-col justify-center space-y-2 sm:w-2/4">
            <div className="text-center text-xl font-bold">From</div>

            <LanguageSelect
              language={inputLanguage}
              onChange={(value) => {
                setInputLanguage(value);
                setHasTranslated(false);
                // setInputCode('');
                // setOutputCode('');
              }}
            />

            {inputLanguage === 'Natural Language' ? (
              <TextBlock
                text={inputCode}
                editable={!loading}
                onChange={(value) => {
                  setInputCode(value);
                  setHasTranslated(false);
                }}
              />
            ) : (
              <CodeBlock
                code={inputCode}
                editable={!loading}
                onChange={(value) => {
                  setInputCode(value);
                  setHasTranslated(false);
                }}
              />
            )}
          </div>
          <div className="mt-8 flex h-full flex-col justify-center space-y-2 sm:mt-0 sm:w-2/4">
            <div className="text-center text-xl font-bold">TO</div>

            <LanguageSelect
              language={outputLanguage}
              onChange={(value) => {
                setOutputLanguage(value);
                setOutputCode('');
              }}
            />

            {outputLanguage === 'Natural Language' ? (
              <TextBlock text={outputCode} />
            ) : (
              <CodeBlock code={outputCode} />
            )}
          </div>
        </div>
		
		<div className="mt-5 text-center text-sm">
		  {loading
		    ? '...'// Generating
		    : hasTranslated
		    ? 'Output copied to clipboard!'
		    : 'Enter some code and click "Generate"'}
		</div>
		
		<div className="mt-5 flex items-center space-x-2">
		  <button
		    className="w-[140px] cursor-pointer rounded-full bg-blue-500 px-4 py-2 font-bold hover:bg-blue-600 active:bg-blue-700"
		    onClick={() => handleTranslate()}
		    disabled={loading}
		  >
		    {loading ? 'Generating...' : 'Generate'}
		  </button>
		  <a href="https://ko-fi.com/audi_guzz" className="text-gray cursor-pointer rounded-full">
		  	<div className="flex justify-center items-center">
		  		<p className="ml-1 mr-2 text-white">Buy me a Coffee</p>
		  		<svg width="30" height="30" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
		  		    <path fill="#ffffff" d="M208 80H32a8 8 0 0 0-8 8v48a96.3 96.3 0 0 0 32.54 72H32a8 8 0 0 0 0 16h176a8 8 0 0 0 0-16h-24.54a96.59 96.59 0 0 0 27-40.09A40 40 0 0 0 248 128v-8a40 40 0 0 0-40-40Zm24 48a24 24 0 0 1-17.2 23a95.78 95.78 0 0 0 1.2-15V97.38A24 24 0 0 1 232 120ZM112 56V24a8 8 0 0 1 16 0v32a8 8 0 0 1-16 0Zm32 0V24a8 8 0 0 1 16 0v32a8 8 0 0 1-16 0Zm-64 0V24a8 8 0 0 1 16 0v32a8 8 0 0 1-16 0Z"/>
		  		</svg>
		  	</div>
		  </a>
		</div>
	  </div>
	  <div className="pl-6 pr-6 md:pl-20 md:pr-20 bg-[#0E1117]">
		<div id="about" className="text-white">
		  <div className="text-2xl">About Us</div>
		  <ul className="mt-4 list-disc list-inside">
		    <li className="mb-2">AICodeConvert simplifies coding with AI by integrating AI Code Translator and AI Code Generator. </li>
		    <li className="mb-2">It efficiently translates existing code into different programming languages (AI Code Translator) and automatically generates high-quality code snippets and templates (AI Code Generator). </li>
				  <li className="mb-2">This powerful combination makes AICodeConvert an indispensable tool for developers, 
					providing a convenient and intelligent coding experience.</li>
		    <li>All for free.</li>
		  </ul>
		</div>
		<div id="contact" className="text-white pt-4">
		  <div className="text-2xl">Contact</div>
		  <div className="flex justify-start items-center mb-2 space-y-2 mt-2 flex-wrap">
		  	<a href="https://github.com/JustAIGithub/AI-Code-Convert" className="text-gray cursor-pointer mr-4">
		  		<svg width="26" height="26" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
		  			<path fill="#ffffff" d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5c.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34c-.46-1.16-1.11-1.47-1.11-1.47c-.91-.62.07-.6.07-.6c1 .07 1.53 1.03 1.53 1.03c.87 1.52 2.34 1.07 2.91.83c.09-.65.35-1.09.63-1.34c-2.22-.25-4.55-1.11-4.55-4.92c0-1.11.38-2 1.03-2.71c-.1-.25-.45-1.29.1-2.64c0 0 .84-.27 2.75 1.02c.79-.22 1.65-.33 2.5-.33c.85 0 1.71.11 2.5.33c1.91-1.29 2.75-1.02 2.75-1.02c.55 1.35.2 2.39.1 2.64c.65.71 1.03 1.6 1.03 2.71c0 3.82-2.34 4.66-4.57 4.91c.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2Z"/>
		  		</svg>
		  	</a>
		  	<a href="https://twitter.com/AUDI_GUZZ" className="text-gray cursor-pointer mr-4">
		  		<svg width="26" height="26" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
		  		    <path fill="#ffffff" d="M459.37 151.716c.325 4.548.325 9.097.325 13.645c0 138.72-105.583 298.558-298.558 298.558c-59.452 0-114.68-17.219-161.137-47.106c8.447.974 16.568 1.299 25.34 1.299c49.055 0 94.213-16.568 130.274-44.832c-46.132-.975-84.792-31.188-98.112-72.772c6.498.974 12.995 1.624 19.818 1.624c9.421 0 18.843-1.3 27.614-3.573c-48.081-9.747-84.143-51.98-84.143-102.985v-1.299c13.969 7.797 30.214 12.67 47.431 13.319c-28.264-18.843-46.781-51.005-46.781-87.391c0-19.492 5.197-37.36 14.294-52.954c51.655 63.675 129.3 105.258 216.365 109.807c-1.624-7.797-2.599-15.918-2.599-24.04c0-57.828 46.782-104.934 104.934-104.934c30.213 0 57.502 12.67 76.67 33.137c23.715-4.548 46.456-13.32 66.599-25.34c-7.798 24.366-24.366 44.833-46.132 57.827c21.117-2.273 41.584-8.122 60.426-16.243c-14.292 20.791-32.161 39.308-52.628 54.253z"/>
		  		</svg>
		  	</a>
			<a href="https://base64.kr/en" className="text-gray cursor-pointer rounded-full mr-4">
				<div 
					className="items-center flex text-sm font-medium justify-center py-2 px-4 border rounded-full">
					<svg width="20" height="20" viewBox="0 0 15 15" xmlns="http://www.w3.org/2000/svg">
						<path fill="#ffffff" fillRule="evenodd" d="m6.007 13.418l2-12l.986.164l-2 12l-.986-.164Zm-.8-8.918l-3 3l3 3l-.707.707L.793 7.5L4.5 3.793l.707.707Zm5.293-.707L14.207 7.5L10.5 11.207l-.707-.707l3-3l-3-3l.707-.707Z" clipRule="evenodd"/>
					</svg>
					<p className="ml-2 text-white">Base64.kr</p>
				</div>
			</a>
			<a href="https://ailandingpagegenerator.com" className="text-gray cursor-pointer rounded-full mr-4">
				<div 
					className="items-center flex text-sm font-medium justify-center py-2 px-4 border rounded-full">
					<svg width="20" height="20" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
					    <path fill="#f43f5e" d="M96 63.38C142.49 27.25 201.55 7.31 260.51 8.81c29.58-.38 59.11 5.37 86.91 15.33c-24.13-4.63-49-6.34-73.38-2.45C231.17 27 191 48.84 162.21 80.87c5.67-1 10.78-3.67 16-5.86c18.14-7.87 37.49-13.26 57.23-14.83c19.74-2.13 39.64-.43 59.28 1.92c-14.42 2.79-29.12 4.57-43 9.59c-34.43 11.07-65.27 33.16-86.3 62.63c-13.8 19.71-23.63 42.86-24.67 67.13c-.35 16.49 5.22 34.81 19.83 44a53.27 53.27 0 0 0 37.52 6.74c15.45-2.46 30.07-8.64 43.6-16.33c11.52-6.82 22.67-14.55 32-24.25c3.79-3.22 2.53-8.45 2.62-12.79c-2.12-.34-4.38-1.11-6.3.3a203 203 0 0 1-35.82 15.37c-20 6.17-42.16 8.46-62.1.78c12.79 1.73 26.06.31 37.74-5.44c20.23-9.72 36.81-25.2 54.44-38.77a526.57 526.57 0 0 1 88.9-55.31c25.71-12 52.94-22.78 81.57-24.12c-15.63 13.72-32.15 26.52-46.78 41.38c-14.51 14-27.46 29.5-40.11 45.18c-3.52 4.6-8.95 6.94-13.58 10.16a150.7 150.7 0 0 0-51.89 60.1c-9.33 19.68-14.5 41.85-11.77 63.65c1.94 13.69 8.71 27.59 20.9 34.91c12.9 8 29.05 8.07 43.48 5.1c32.8-7.45 61.43-28.89 81-55.84c20.44-27.52 30.52-62.2 29.16-96.35c-.52-7.5-1.57-15-1.66-22.49c8 19.48 14.82 39.71 16.65 60.83c2 14.28.75 28.76-1.62 42.9c-1.91 11-5.67 21.51-7.78 32.43a165 165 0 0 0 39.34-81.07a183.64 183.64 0 0 0-14.21-104.64c20.78 32 32.34 69.58 35.71 107.48c.49 12.73.49 25.51 0 38.23A243.21 243.21 0 0 1 482 371.34c-26.12 47.34-68 85.63-117.19 108c-78.29 36.23-174.68 31.32-248-14.68A248.34 248.34 0 0 1 25.36 366A238.34 238.34 0 0 1 0 273.08v-31.34C3.93 172 40.87 105.82 96 63.38m222 80.33a79.13 79.13 0 0 0 16-4.48c5-1.77 9.24-5.94 10.32-11.22c-8.96 4.99-17.98 9.92-26.32 15.7z"/>
					</svg>
					<p className="ml-2 text-white">AILandingPageGenerator.com</p>
				</div>
			</a>
		  </div>
		  <div>
			Mail: enqueueit@gmail.com
		  </div>
		</div>
	  </div>
	  <div className="bg-[#0E1117] pt-4 pb-2 text-center text-white text-sm pt-10">
	  	AI Code Convert Copyright © <span className="text-blue-500">aicodeconvert.com</span>
	  </div>
    </>
  );
}