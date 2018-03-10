const $div = document.createElement('div')

function finder(criteria) {
  return function(node) {
    return Object.keys(criteria).every(key => {
      // it is possible to pass 'states' or 'state'
      if ('state' == key || 'states' == key) {
        let states = criteria[key]

        return Object.keys(states).every(s => node['states'][s] === states[s])       
      }

      let val = node[key]
      let c = getRegExp(criteria[key])

      if ('states' == key) {
        let states = criteria[key]

        return Object.keys(states).every(s => node[key][s] === states[s])
      } else {
        if ('text' == key) {
          $div.innerHTML = val
          val = $div.innerText
        }

        return c.test(val)
      }
    })
  }
}

function getRegExp(val) {
  if (val instanceof RegExp) {
    return val
  }

  return new RegExp(`^${val}$`, 'g')
}

function getAllChildren(source) {
  let result = []

  source.forEach(function collect(node) {
    result.push(node)

    if (node.children) {
      node.children.forEach(collect)
    }
  })

  return result
}


export default function find(source, criteria, deep = true) {
  if (!source || !source.length) {
    return null
  }

  if (deep) {
    source = getAllChildren(source)
  }

  // find by index
  if ('number' == typeof criteria) {
    return source[criteria] || null
  }

  if ('string' == typeof criteria || criteria instanceof RegExp) {
    criteria = {
      text: criteria
    }
  }

  if ('function' != typeof criteria) {
    criteria = finder(criteria)
  }

  let result = source.filter(criteria)

  if (result.length) {
    return result
  }

  return null
}
