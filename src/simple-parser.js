import getId from 'nanoid'

const SEPARATOR = ':'
const WHITESPACE = ' '
const NEWLINE = '\n'
const EMPTY = ''
const referenceFields = ['depends']

export const parse = text => {
  const lines = text.split(NEWLINE)
  const output = []
  let i = 0
  while (i < lines.length) {
    if (lines[i].length === 0) {
      i++
      continue
    }
    const [pkg, lastField] = extractPackage(lines, i)
    output.push(pkg)
    i = lastField + 1
  }

  output.forEach(pkg => {
    if (!pkg.depends) return
    pkg.depends.forEach(dep => addReverseDep(pkg.package, dep, output))
  })
  return output
}

const addReverseDep = (pkgName, depName, data) => {
  const reverseIndex = data.findIndex(pkg => pkg.package === depName)
  if (reverseIndex === -1) return
  if (data[reverseIndex].reversedepends) {
    data[reverseIndex].reversedepends.push(pkgName)
  } else {
    data[reverseIndex].reversedepends = [pkgName]
  }
}

// Returns the extracted package and position of last line read
const extractPackage = (data, packageIndex) => {
  const pkg = { id: getId() }
  let i = packageIndex
  while (data[i] && data[i].length > 0) {
    const [key, value, lastLine] = extractField(data, i)
    pkg[key] = value
    i = lastLine + 1
  }
  return [pkg, i - 1]
}

// Return key-value pair and positon of last line read
const extractField = (data, fieldIndex) => {
  const line = data[fieldIndex]
  const separatorIndex = line.indexOf(SEPARATOR)

  let value = line.substring(separatorIndex + 1).trim()
  const key = line.substring(0, separatorIndex)
    .replace(/-/, EMPTY)
    .toLowerCase()

  // Handle fields with references to other packages
  // This parser assumes Depend, Pre-Depend etc. are single-line
  if (referenceFields.includes(key)) {
    value = value.split(',')
    for (let i = 0; i < value.length; i++) {
      const versioningIndex = value[i].indexOf('(')
      if (versioningIndex !== -1) {
        value[i] = value[i].substring(0, versioningIndex).trim()
      }
    }

    // Remove duplicate values
    value = Array.from(new Set(value))
    return [key, value, fieldIndex]
  }

  // Handle single line fields
  if (!data[fieldIndex + 1] || !data[fieldIndex + 1].startsWith(WHITESPACE)) {
    return [key, value.trim(), fieldIndex]
  }

  // Handle multiline fields
  value = [value]
  let i = fieldIndex + 1
  while (true) {
    value.push(data[i])
    if (data[i + 1] && data[i + 1].startsWith(WHITESPACE)) i++
    else break
  }
  return [key, value, i]
}
