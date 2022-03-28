<template><h1 id="indexeddb-的使用" tabindex="-1"><a class="header-anchor" href="#indexeddb-的使用" aria-hidden="true">#</a> IndexedDB 的使用</h1>
<p>IndexedDB 主要用来客户端存储大量数据。它是按照域名分配独立空间。</p>
<p>一个独立域名下可以创建多个数据库，每个数据库下可以创建多个对象存储空间（表），一个对象存储空间可以存储多个对象数据。</p>
<img src="@source/lowcode/img/1.png" style="zoom: 67%;" />
<p>IndexedDB 有以下特点：</p>
<ul>
<li>非关系型数据库</li>
<li>持久化存储</li>
<li>异步操作</li>
<li>支持事务</li>
<li>同源策略</li>
<li>存储容量大</li>
</ul>
<h2 id="_1-indexeddb-的四个概念" tabindex="-1"><a class="header-anchor" href="#_1-indexeddb-的四个概念" aria-hidden="true">#</a> 1 IndexedDB 的四个概念</h2>
<ul>
<li>仓库 ObjectStore</li>
<li>索引 index</li>
<li>游标 cursor</li>
<li>事务</li>
</ul>
<p>indexedDB 没有表的概念，它只有仓库 store 的概念，把仓库理解为表就可以了</p>
<p>可以给对应的表添加索引，以便加快查找速率</p>
<p>游标可以想象为一个指针</p>
<p>对数据库进行操作时，如果失败了，就会回滚到最初的状态</p>
<h2 id="_2-实操" tabindex="-1"><a class="header-anchor" href="#_2-实操" aria-hidden="true">#</a> 2 实操</h2>
<h3 id="_2-1-创建或连接数据库" tabindex="-1"><a class="header-anchor" href="#_2-1-创建或连接数据库" aria-hidden="true">#</a> 2.1 创建或连接数据库</h3>
<div class="language-javascript ext-js line-numbers-mode"><pre v-pre class="language-javascript"><code><span class="token doc-comment comment">/**
 * 打开数据库
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>object<span class="token punctuation">}</span></span> <span class="token parameter">dbName</span> 数据库的名字
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>string<span class="token punctuation">}</span></span> <span class="token parameter">storeName</span> 仓库名称
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>string<span class="token punctuation">}</span></span> <span class="token parameter">version</span> 数据库的版本
 * <span class="token keyword">@return</span> <span class="token class-name"><span class="token punctuation">{</span>object<span class="token punctuation">}</span></span> 该函数会返回一个数据库实例
 */</span>
<span class="token keyword">function</span> <span class="token function">openDB</span><span class="token punctuation">(</span><span class="token parameter">dbName<span class="token punctuation">,</span> version <span class="token operator">=</span> <span class="token number">1</span></span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">return</span> <span class="token keyword">new</span> <span class="token class-name">Promise</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token parameter">resolve<span class="token punctuation">,</span> reject</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span>
    <span class="token comment">//  兼容浏览器</span>
    <span class="token keyword">var</span> indexedDB <span class="token operator">=</span> window<span class="token punctuation">.</span>indexedDB <span class="token operator">||</span> window<span class="token punctuation">.</span>mozIndexedDB <span class="token operator">||</span> window<span class="token punctuation">.</span>webkitIndexedDB <span class="token operator">||</span> window<span class="token punctuation">.</span>msIndexedDB
    <span class="token keyword">let</span> db
    <span class="token comment">// 打开数据库，若没有则会创建</span>
    <span class="token keyword">const</span> request <span class="token operator">=</span> indexedDB<span class="token punctuation">.</span><span class="token function">open</span><span class="token punctuation">(</span>dbName<span class="token punctuation">,</span> version<span class="token punctuation">)</span>
    <span class="token comment">// 数据库打开成功回调</span>
    request<span class="token punctuation">.</span><span class="token function-variable function">onsuccess</span> <span class="token operator">=</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token parameter">event</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      db <span class="token operator">=</span> event<span class="token punctuation">.</span>target<span class="token punctuation">.</span>result <span class="token comment">// 数据库对象</span>
      console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">'数据库打开成功'</span><span class="token punctuation">)</span>
      <span class="token function">resolve</span><span class="token punctuation">(</span>db<span class="token punctuation">)</span>
    <span class="token punctuation">}</span>
    <span class="token comment">// 数据库打开失败的回调</span>
    request<span class="token punctuation">.</span><span class="token function-variable function">onerror</span> <span class="token operator">=</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token parameter">event</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">'数据库打开报错'</span><span class="token punctuation">)</span>
    <span class="token punctuation">}</span>
    <span class="token comment">// 数据库有更新时候的回调</span>
    request<span class="token punctuation">.</span><span class="token function-variable function">onupgradeneeded</span> <span class="token operator">=</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token parameter">event</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token comment">// 数据库创建或升级的时候会触发</span>
      console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">'onupgradeneeded'</span><span class="token punctuation">)</span>
      db <span class="token operator">=</span> event<span class="token punctuation">.</span>target<span class="token punctuation">.</span>result <span class="token comment">// 数据库对象</span>
      <span class="token keyword">var</span> objectStore
      <span class="token comment">// 创建存储库</span>
      objectStore <span class="token operator">=</span> db<span class="token punctuation">.</span><span class="token function">createObjectStore</span><span class="token punctuation">(</span><span class="token string">'users'</span><span class="token punctuation">,</span> <span class="token punctuation">{</span>
        <span class="token literal-property property">keyPath</span><span class="token operator">:</span> <span class="token string">'uuid'</span><span class="token punctuation">,</span> <span class="token comment">// 这是主键</span>
        <span class="token comment">// autoIncrement: true // 实现自增</span>
      <span class="token punctuation">}</span><span class="token punctuation">)</span>
      <span class="token comment">// 创建索引，在后面查询数据的时候可以根据索引查</span>
      objectStore<span class="token punctuation">.</span><span class="token function">createIndex</span><span class="token punctuation">(</span><span class="token string">'uuid'</span><span class="token punctuation">,</span> <span class="token string">'uuid'</span><span class="token punctuation">,</span> <span class="token punctuation">{</span> <span class="token literal-property property">unique</span><span class="token operator">:</span> <span class="token boolean">true</span> <span class="token punctuation">}</span><span class="token punctuation">)</span>
      objectStore<span class="token punctuation">.</span><span class="token function">createIndex</span><span class="token punctuation">(</span><span class="token string">'name'</span><span class="token punctuation">,</span> <span class="token string">'name'</span><span class="token punctuation">,</span> <span class="token punctuation">{</span> <span class="token literal-property property">unique</span><span class="token operator">:</span> <span class="token boolean">false</span> <span class="token punctuation">}</span><span class="token punctuation">)</span>
      objectStore<span class="token punctuation">.</span><span class="token function">createIndex</span><span class="token punctuation">(</span><span class="token string">'age'</span><span class="token punctuation">,</span> <span class="token string">'age'</span><span class="token punctuation">,</span> <span class="token punctuation">{</span>
        <span class="token literal-property property">unique</span><span class="token operator">:</span> <span class="token boolean">false</span><span class="token punctuation">,</span>
      <span class="token punctuation">}</span><span class="token punctuation">)</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span>
<span class="token punctuation">}</span>

</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br><span class="line-number">29</span><br><span class="line-number">30</span><br><span class="line-number">31</span><br><span class="line-number">32</span><br><span class="line-number">33</span><br><span class="line-number">34</span><br><span class="line-number">35</span><br><span class="line-number">36</span><br><span class="line-number">37</span><br><span class="line-number">38</span><br><span class="line-number">39</span><br><span class="line-number">40</span><br><span class="line-number">41</span><br><span class="line-number">42</span><br><span class="line-number">43</span><br><span class="line-number">44</span><br><span class="line-number">45</span><br></div></div><h3 id="_2-2-插入数据" tabindex="-1"><a class="header-anchor" href="#_2-2-插入数据" aria-hidden="true">#</a> 2.2 插入数据</h3>
</template>
