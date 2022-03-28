<template><h1 id="自动软件生成系统的研究与实践" tabindex="-1"><a class="header-anchor" href="#自动软件生成系统的研究与实践" aria-hidden="true">#</a> 自动软件生成系统的研究与实践</h1>
<p>一个现代化的软件，往往由三部分组成，分别是：</p>
<ul>
<li>前端</li>
<li>网络请求</li>
<li>后端</li>
</ul>
<p>一个软件系统要想实现自动化生成，则这三部分都需要实现自动化</p>
<p>这个课题无疑是复杂的，为了让过程更为简明清晰，笔者做了以下简化：</p>
<ul>
<li>仅生成 <code>HTML</code> 部分元素，包括
<ul>
<li>1-6 级标题，即 <code>h1</code> 到 <code>h6</code> 标签</li>
<li>无序列表，即 <code>ul</code> 和 <code>li</code> 标签</li>
<li>有序列表，即 <code>ol</code> 和 <code>li</code> 标签</li>
<li>分割线，即 <code>hr</code> 标签</li>
<li>按钮，即 <code>button</code> 标签</li>
<li>单行文本框，即 <code>input</code> 标签，其 <code>type</code> 为 <code>text</code></li>
<li>多行文本框，即 <code>textarea</code> 标签</li>
</ul>
</li>
<li>数据库使用浏览器自带的本地数据库 <code>IndexedDB</code></li>
</ul>
<p>由于数据库是浏览器本地的数据库，因此我们不必要关注网络请求；此外，由于 IndexedDB 是一个非关系型数据库，因此我们不必生成 SQL 语句，减轻了工作压力。</p>
<h2 id="_1-生成代码的原理" tabindex="-1"><a class="header-anchor" href="#_1-生成代码的原理" aria-hidden="true">#</a> 1 生成代码的原理</h2>
<p>任何代码都可以看为两部分：</p>
<ul>
<li>数据，数据能够改变</li>
<li>模型，模型保持不变</li>
</ul>
<p>举例来说，这是一个 Hello World 程序：</p>
<div class="language-c ext-c line-numbers-mode"><pre v-pre class="language-c"><code><span class="token keyword">int</span> <span class="token function">main</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
	<span class="token function">printf</span><span class="token punctuation">(</span><span class="token string">"Hello World"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">return</span> <span class="token number">0</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br></div></div><p>我们可以认为，<code>Hello World</code> 这个字符串是数据，其他的代码都是模型。</p>
<p>如果我们想要一个生成一个能够输出字符串的 C 语言程序，我们只需要改变数据，而其他保持不变就可以了。</p>
<p>软件系统虽然很复杂，但我们仍旧可以将他们都看为这两部分。</p>
<h2 id="_2-生成-html-位置属性和样式标签" tabindex="-1"><a class="header-anchor" href="#_2-生成-html-位置属性和样式标签" aria-hidden="true">#</a> 2 生成 HTML 位置属性和样式标签</h2>
<p>我们首先要区分，对一个 HTML 文件来说，什么是数据，什么是模型。</p>
<p>因为软件系统希望能够改变样式和位置，还能够选择不同的标签，所以 HTML 的标签、位置和样式都是数据。而模型就是它的结构，如下所示：</p>
<div class="language-html ext-html line-numbers-mode"><pre v-pre class="language-html"><code><span class="token doctype"><span class="token punctuation">&lt;!</span><span class="token doctype-tag">DOCTYPE</span> <span class="token name">html</span><span class="token punctuation">></span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>html</span> <span class="token attr-name">lang</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>en<span class="token punctuation">"</span></span><span class="token punctuation">></span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>head</span><span class="token punctuation">></span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>meta</span> <span class="token attr-name">charset</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>UTF-8<span class="token punctuation">"</span></span><span class="token punctuation">></span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>meta</span> <span class="token attr-name">http-equiv</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>X-UA-Compatible<span class="token punctuation">"</span></span> <span class="token attr-name">content</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>IE=edge<span class="token punctuation">"</span></span><span class="token punctuation">></span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>meta</span> <span class="token attr-name">name</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>viewport<span class="token punctuation">"</span></span> <span class="token attr-name">content</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>width=device-width, initial-scale=1.0<span class="token punctuation">"</span></span><span class="token punctuation">></span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>title</span><span class="token punctuation">></span></span>Document<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>title</span><span class="token punctuation">></span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>head</span><span class="token punctuation">></span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>body</span><span class="token punctuation">></span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>body</span><span class="token punctuation">></span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>html</span><span class="token punctuation">></span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br></div></div><p>我们需要的，是把生成的 HTML 元素，塞到 body 标签中。</p>
<h2 id="_3-生成-indexeddb-的增删改查语句" tabindex="-1"><a class="header-anchor" href="#_3-生成-indexeddb-的增删改查语句" aria-hidden="true">#</a> 3 生成 IndexedDB 的增删改查语句</h2>
<p>同样地，我们也要区分对 <code>IndexedDB</code> 来说，什么是数据，什么是模型。</p>
<p>考虑到多数人比较熟悉关系型数据库，我们先举例关系型数据库的例子。</p>
<p>比如从 student 表中查询一个 id 为 1 的学生的名字，会有 SQL 语句如下：</p>
<div class="language-sql ext-sql line-numbers-mode"><pre v-pre class="language-sql"><code><span class="token keyword">SELECT</span> name <span class="token keyword">FROM</span> student <span class="token keyword">WHERE</span> id <span class="token operator">=</span> <span class="token number">1</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br></div></div><p>这里的 <code>name</code>，<code>student</code>，<code>id</code> 和 <code>1</code> 均是数据，而其他不变的结构则认为是模型。</p>
<p>事实上，通过对象直接映射生成 SQL 语句的，已经有成熟的解决办法，称之为 <code>ORM</code> 框架。</p>
<h2 id="_4-使用-json-统一表示数据" tabindex="-1"><a class="header-anchor" href="#_4-使用-json-统一表示数据" aria-hidden="true">#</a> 4 使用 JSON 统一表示数据</h2>
<p>在明白数据、模型的概念后，我们面临的一个问题是，如何恰当地表示数据，以方便我们和模型结合生成代码。经过调研发现，绝大部分的自动软件生成系统，都采取 <code>JSON</code> 作为中间格式。</p>
<p>采用 <code>JSON</code> 有以下优点：</p>
<ul>
<li>结构简单</li>
<li>能够完整表达所需要的数据信息</li>
<li>和 JavaScript 配合非常良好</li>
</ul>
<p>现在我们来规定 HTML 和 IndexedDB 的 JSON 格式。</p>
<h3 id="_4-1-html-的-json-schema" tabindex="-1"><a class="header-anchor" href="#_4-1-html-的-json-schema" aria-hidden="true">#</a> 4.1 HTML 的 JSON Schema</h3>
<p>如何表示 HTML 的位置关系呢？目前有两种方法：</p>
<ul>
<li>使用嵌套，用来表示 HTML 的树结构</li>
<li>不使用嵌套，而是直接使用 <code>top</code> 和 <code>left</code> 来直接定位元素</li>
</ul>
<p>第一种方法如下所示：</p>
<div class="language-json ext-json line-numbers-mode"><pre v-pre class="language-json"><code><span class="token punctuation">{</span>
	tag<span class="token operator">:</span> <span class="token string">"div"</span><span class="token punctuation">,</span>
    children<span class="token operator">:</span> <span class="token punctuation">[</span>
        <span class="token punctuation">{</span>
            tag<span class="token operator">:</span> <span class="token string">"h1"</span><span class="token punctuation">,</span>
            children<span class="token operator">:</span> <span class="token punctuation">{</span>
                tag<span class="token operator">:</span> <span class="token string">"span"</span><span class="token punctuation">,</span>
                text<span class="token operator">:</span> <span class="token string">"hello world"</span>
            <span class="token punctuation">}</span>
        <span class="token punctuation">}</span><span class="token punctuation">,</span>
        <span class="token punctuation">{</span>
            tag<span class="token operator">:</span> <span class="token string">"h1"</span><span class="token punctuation">,</span>
            text<span class="token operator">:</span> <span class="token string">"this is json"</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">]</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br></div></div><p>第二种方法如下所示：</p>
<div class="language-json ext-json line-numbers-mode"><pre v-pre class="language-json"><code><span class="token punctuation">{</span>
    <span class="token property">"tag"</span><span class="token operator">:</span> <span class="token string">"div"</span><span class="token punctuation">,</span>
    <span class="token property">"width"</span><span class="token operator">:</span> <span class="token number">550</span><span class="token punctuation">,</span>
    <span class="token property">"height"</span><span class="token operator">:</span> <span class="token number">550</span><span class="token punctuation">,</span>
    <span class="token property">"children"</span><span class="token operator">:</span> <span class="token punctuation">[</span>
        <span class="token punctuation">{</span>
            <span class="token property">"tag"</span><span class="token operator">:</span> <span class="token string">"button"</span><span class="token punctuation">,</span>
            <span class="token property">"top"</span><span class="token operator">:</span> <span class="token number">100</span><span class="token punctuation">,</span>
            <span class="token property">"left"</span><span class="token operator">:</span> <span class="token number">100</span><span class="token punctuation">,</span>
            <span class="token property">"zIndex"</span><span class="token operator">:</span> <span class="token number">1</span><span class="token punctuation">,</span>
            <span class="token property">"text"</span><span class="token operator">:</span> <span class="token string">"按钮"</span><span class="token punctuation">,</span>
            <span class="token property">"backgroundColor"</span><span class="token operator">:</span> <span class="token string">"red"</span><span class="token punctuation">,</span>
            <span class="token property">"width"</span><span class="token operator">:</span> <span class="token number">100</span><span class="token punctuation">,</span>
            <span class="token property">"height"</span><span class="token operator">:</span> <span class="token number">100</span>
		<span class="token punctuation">}</span><span class="token punctuation">,</span>
        <span class="token punctuation">{</span>
        	<span class="token property">"tag"</span><span class="token operator">:</span> <span class="token string">"h1"</span><span class="token punctuation">,</span>
            <span class="token property">"top"</span><span class="token operator">:</span> <span class="token number">100</span><span class="token punctuation">,</span>
            <span class="token property">"left"</span><span class="token operator">:</span> <span class="token number">200</span><span class="token punctuation">,</span>
            <span class="token property">"zIndex"</span><span class="token operator">:</span> <span class="token number">1</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">]</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br></div></div><p>简单起见，我们选择第二种办法，即使用 top 和 left 来确定 HTML 标签的位置关系。</p>
<h3 id="_4-2-indexeddb-的-json-schema" tabindex="-1"><a class="header-anchor" href="#_4-2-indexeddb-的-json-schema" aria-hidden="true">#</a> 4.2 IndexedDB 的 JSON Schema</h3>
<h2 id="_5-总结" tabindex="-1"><a class="header-anchor" href="#_5-总结" aria-hidden="true">#</a> 5 总结</h2>
<p>今天的内容就先写到这里</p>
</template>
