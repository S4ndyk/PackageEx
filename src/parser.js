import generateId from 'nanoid'

export const parse = text => {
  const toLines = text.split('\n')
  let output = []

  let currentPackage = {}
  let currentKey = ''
  let currentValue = ''
  toLines.forEach(line => {
    if (line.length === 0) {
      currentPackage.id = generateId()
      output = output.concat(currentPackage)
      currentPackage = {}
    } else if (line.startsWith(' ')) {
      // Multiline values are transformed into fields
      if (!Array.isArray(currentValue) && currentKey === 'Description') {
        currentValue = [currentValue]
      }
      currentValue = currentValue.concat(line.trim())
      currentPackage[currentKey] = currentValue
    } else {
      const split = line.indexOf(':')
      currentKey = line.substring(0, split)
      currentValue = line.substring(split + 1).trim()
      currentPackage[currentKey] = currentValue
    }
  })
  currentPackage.id = generateId()
  output = output.concat(currentPackage)

  output.forEach(pack => {
    let deps = pack.Depends
    if (deps) {
      deps = deps.split(',')
      deps = deps.map(dep => {
        if (dep.indexOf('(') !== -1) {
          dep = dep.substring(0, dep.indexOf('('))
        }
        dep = dep.trim()
        return dep
      })
      deps = deps.map(dep => {
        const depObject = output.find(packToFind => packToFind.Package === dep)
        if (depObject) {
          return {
            id: depObject.id,
            name: depObject.Package
          }
        }
        return { name: dep }
      })
      pack.Depends = deps
    }
  })
  return output
}
