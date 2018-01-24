const google = require('googleapis')
const sheets = google.sheets('v4')
const SPREADSHEET_ID = '1Gu3xaaw5ZTywI3vakH1BGzGExFS4_p612FDRWQdhusY'

function getStarOffset(star) {
	switch (star) {
	case 1 : return 3
	case 2 : return 2
	case 3 : return 1
	case 4 : return 0
	}
}

function getTypeNum(type) {
	switch (type) {
	case 'prosedurpelayanan': return 1
	case 'persyaratanpelayanan': return 2
	case 'kejelasanpetugas': return 3
	case 'kedisiplinanpetugas': return 4
	case 'tanggungjawab': return 5
	case 'kemampuanpetugas': return 6
	case 'kecepatanpelayanan': return 7
	case 'keadilanmendapatkan': return 8
	case 'kesopanandan': return 9
	case 'kewajaranbiaya': return 10
	case 'kepastianbiaya': return 11
	case 'kepastianjadwal': return 12
	case 'kenyamananlingkungan': return 13
	case 'keamananpelayanan': return 14
	}
}

function getTypeOffset(type) {
	let typeNum = getTypeNum(type)
	let typeOffset = (typeNum - 1) * 3 + typeNum + 3
	return typeOffset
}

function getRow() {
	let now = new Date()
	let start = new Date(now.getFullYear(), 0, 0)
	let diff = (now - start) + ((start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000)
	let oneDay = 1000 * 60 * 60 * 24
	let day = Math.floor(diff / oneDay)
	return day + 2
}

function getCol(type, star) {
	let starOffset = getStarOffset(star)
	let typeOffset = getTypeOffset(type)
	let colNum = typeOffset + starOffset
	let colLetter
	let firstLetter = ''
	if (colNum / 26 >= 1 && colNum != 26) {
		if (colNum > 26 && colNum % 26 == 0) {
			firstLetter = String.fromCharCode(64 + colNum / 26 - 1)
			colNum = 26
		} else {
			firstLetter = String.fromCharCode(64 + colNum / 26)			
			colNum = colNum - (26 * parseInt(colNum / 26, 10))
		}
	}
	colLetter = firstLetter + String.fromCharCode(64 + colNum)
	return colLetter
}

async function getCurrentRating(auth, range, cb) {
	sheets.spreadsheets.values.get({
		auth: auth,
		spreadsheetId: SPREADSHEET_ID,
		range: range
	}, function(err, result) {
		if (err) {
			console.log('API Error: '+err)
		} else {
			cb(result.values[0][0])
		}
	})
}


async function writeRating(auth, type, star) {
	let destRow = getRow()
	let destCol = getCol(type, star)
	let range = destCol+''+destRow
	getCurrentRating(auth, range, (currentRating) => {
		let rating = parseInt(currentRating) + 1
		let request = {
			auth: auth,
			spreadsheetId: SPREADSHEET_ID,
			range: range,
			valueInputOption: 'USER_ENTERED',
			resource: {
				values: [[rating]]
			}
		}
		sheets.spreadsheets.values.update(request, function(err, result) {
			if (err) {
				console.log('The API returned an error: ' + err)
				return
			} else {
				console.log('%d cells updated.', result.updatedCells)
			}
		})
	})
}

module.exports = {
	writeRating
}