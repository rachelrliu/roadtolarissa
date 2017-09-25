// bashed on
// http://ashkenas.com/journo/docs/journo.html
// https://github.com/sveltejs/svelte.technology/blob/master/scripts/prep/build-blog.js

var fs = require('fs')

var marked = require('marked')
var hljs = require('highlight.js')
var unescape = require('unescape')

var public = `${__dirname}/public`
var source = `${__dirname}/source`


// convert _templates dir into functions
var templates = {}
fs.readdirSync(`${source}/_templates`).forEach(path => {
  var str = fs.readFileSync(`${source}/_templates/${path}`, 'utf8')
  templates[path] = d => eval('`' + str + '`')
})


var posts = fs.readdirSync(`${source}/_posts`).map(parsePost)

fs.writeFileSync(public + '/rss.xml', templates['rss.xml'](posts))
fs.writeFileSync(public + '/sitemap.xml', templates['sitemap.xml'](posts))


// read post path from file system 
function parsePost(path, i){
  // if (i) return
  var slug = path.split('.')[0]
  var date = slug.substr(0, 10)

  var markdown = fs.readFileSync(`${source}/_posts/${path}`, 'utf8')

  // parse metadata from front matter
  var [top, content] = markdown.replace('---\n', '').split('\n---\n')
  var meta = {}
  top.split('\n').forEach(line => {
    var [key, val] = line.split(': ')
    meta[key] = val
  })

  var html = marked( content.replace( /^\t+/gm, match => match.split( '\t' ).join( '  ' ) ) )
      .replace( /<pre><code class="lang-(\w+)">([\s\S]+?)<\/code><\/pre>/g, ( match, lang, value ) => {
        const highlighted = hljs.highlight( lang, unescape(value) ).value
        return `<pre class="lang-${lang}"><code class='hljs'>${highlighted}</code></pre>`
      })

  var post = {slug, date, meta, html}

  var dir = public + meta.permalink
  if (!fs.existsSync(dir)) fs.writeFileSync(dir)
  fs.writeFileSync(`${dir}/index.html`, templates[post.meta.template](post))

  return post
}


// rebuild whole blog
function build(){

}

// update posts
function watch(){

}