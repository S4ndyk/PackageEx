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
      // Multiline values are transformed into arrays
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

  populate(output, 'Depends')
  populate(output, 'Pre-Depends')
  populateReverse(output, 'Depends')
  return output
}

const populate = (packages, field) => {
  packages.forEach(pack => {
    let deps = pack[field]
    if (deps) {
      deps = removeVersionInformation(deps)
      deps = Array.from(new Set(deps))
      deps = mapToObject(deps, packages)
      pack[field] = deps
    }
  })
}

const removeVersionInformation = deps => {
  deps = deps.split(',')
  return deps.map(dep => {
    if (dep.indexOf('(') !== -1) {
      dep = dep.substring(0, dep.indexOf('('))
    }
    dep = dep.trim()
    return dep
  })
}

const mapToObject = (deps, packages) => {
  return deps.map(dep => {
    const depObject = packages.find(packToFind => packToFind.Package === dep)
    if (depObject) {
      return {
        id: depObject.id,
        name: depObject.Package
      }
    }
    return { name: dep }
  })
}

const populateReverse = (output, field) => {
  output.forEach(pack => {
    const deps = pack[field]
    if (deps) {
      deps.forEach(dep => {
        const index = output.findIndex(p => p.id === dep.id)
        if (index === -1) return
        if (!Array.isArray(output[index].ReverseDepends)) {
          output[index].ReverseDepends = [dep]
        }
        output[index].ReverseDepends = output[index].ReverseDepends.concat(dep)
        if (dep.name === 'python') {
          console.log(output[index].ReverseDepends)
        }
      })
    }
  })
}
