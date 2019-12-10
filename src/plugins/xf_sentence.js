let xfSyllPhone = {
  'aa': 'ɑː',
  'ae': 'æ',
  'ah': 'ʌ',
  'ao': 'ɔː',
  'ar': 'eə',
  'aw': 'aʊ',
  'ax': 'ə',
  'ay': 'aɪ',
  'eh': 'e',
  'er': 'ɜː',
  'ey': 'eɪ',
  'ih': 'ɪ',
  'ir': 'ɪə',
  'iy': 'iː',
  'oo': 'ɒ',
  'ow': 'əʊ',
  'oy': 'ɒɪ',
  'uh': 'ʊ',
  'uw': 'uː',
  'ur': 'ʊə',
  'b': 'b',
  'ch': 'tʃ',
  'd': 'd',
  'dh': 'ð',
  'f': 'f',
  'g': 'g',
  'hh': 'h',
  'jh': 'dʒ',
  'k': 'k',
  'l': 'l',
  'm': 'm',
  'n': 'n',
  'ng': 'ŋ',
  'p': 'p',
  'r': 'r',
  's': 's',
  'sh': 'ʃ',
  't': 't',
  'th': 'θ',
  'v': 'v',
  'w': 'w',
  'y': 'j',
  'z': 'z',
  'zh': 'ʒ',
  'dr': 'dr',
  'dz': 'dz',
  'tr': 'tr',
  'ts': 'ts'
}

// 获取句子中所有的单词
const getWords = (sentence) => {
  let words = []
  if (Array.isArray(sentence)) {
    sentence.forEach(sentence => {
      sentence.word.forEach(word => {
        if (word.content !== 'sil' && word.content !== 'fil' && (word.dp_message === '0' || word.dp_message === '16')) {
          let w = {}
          w['word'] = word.content
          w['score'] = word.total_score
          // w['phonemes'] = this.getPhones(word.syll)
          // w['phonetic_symbol'] = this.getSylls(this.getPhones(word.syll))
          w['syllInfos'] = getSyllInfos(word.syll)
          words.push(w)
        }
      })
    })
  } else {
    if (Array.isArray(sentence.word)) {
      sentence.word.forEach(word => {
        if (word.content !== 'sil' && word.content !== 'fil' && (word.dp_message === '0' || word.dp_message === '16')) {
          let w = {}
          w['word'] = word.content
          w['score'] = Math.round(parseFloat(word.total_score))
          // w['phonemes'] = this.getPhones(word.syll)
          // w['phonetic_symbol'] = this.getSylls(this.getPhones(word.syll))
          w['syllInfos'] = getSyllInfos(word.syll)
          words.push(w)
        }
      })
    } else {
      let w = {}
      w['word'] = sentence.word.content
      w['score'] = Math.round(parseFloat(sentence.word.total_score))
      // w['phonemes'] = this.getPhones(sentence.word.syll)
      // w['phonetic_symbol'] = this.getSylls(this.getPhones(sentence.word.syll))
      w['syllInfos'] = getSyllInfos(sentence.word.syll)
      words.push(w)
    }
  }
  return words
}
const getSyllInfos = (syll) => {
  let sylls = []
  if (Array.isArray(syll)) {
    syll.forEach(s => {
      let syllObj = {}
      syllObj['score'] = Math.round(s.syll_score)
      syllObj['content'] = getSyllPhones(s.phone)
      sylls.push(syllObj)
    })
  } else {
    if (syll) {
      let syllObj = {}
      syllObj['score'] = Math.round(syll.syll_score)
      syllObj['content'] = getSyllPhones(syll.phone)
      sylls.push(syllObj)
    }
  }
  return sylls
}
const getSyllPhones = (phone) => {
  let content = ''
  if (Array.isArray(phone)) {
    phone.forEach(p => {
      content += xfSyllPhone[p.content]
    })
  } else {
    content = xfSyllPhone[phone.content]
  }
  return content
}
// 获取所有的音素
const getPhones = (syll) => {
  let phones = []
  if (Array.isArray(syll)) {
    syll.forEach(item => {
      if (Array.isArray(item.phone)) {
        item.phone.forEach(p => {
          let pObj = {}
          pObj['phoneme'] = '[' + xfSyllPhone[p.content] + ']'
          pObj['state'] = parseInt(p.dp_message)
          phones.push(pObj)
        })
      } else {
        let pObj = {}
        pObj['phoneme'] = '[' + xfSyllPhone[item.content] + ']'
        pObj['state'] = parseInt(item.dp_message)
        phones.push(pObj)
      }
    })
  } else {
    if (syll) {
      if (Array.isArray(syll.phone)) {
        syll.phone.forEach(item => {
          let pObj = {}
          pObj['phoneme'] = '[' + xfSyllPhone[item.content] + ']'
          pObj['state'] = parseInt(item.dp_message)
          phones.push(pObj)
        })
      } else {
        let pObj = {}
        pObj['phoneme'] = '[' + xfSyllPhone[syll.phone.content] + ']'
        pObj['state'] = parseInt(syll.phone.dp_message)
        phones.push(pObj)
      }
    }
  }
  return phones
}
// 获取单词发音
const getSylls = (phones) => {
  if (phones) {
    let syll = '['
    phones.forEach(p => {
      syll += p.phoneme.replace('[', '').replace(']', '')
    })
    syll += ']'
    return syll
  }
}

export default {
  getWords,
  getPhones,
  getSylls
}
