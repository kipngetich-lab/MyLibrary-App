const Loan = require('../models/Loan') 
const Book = require('../models/Book') 
const mongoose = require('mongoose')

exports.mostBorrowed = async (req, res, next) => { 
	try { 
		// aggregate by book 
		const pipeline = [ { $group: { _id: '$book', count: { $sum: 1 } } }, { $sort: { count: -1 } }, { $limit: 10 }, { $lookup: { from: 'books', localField: '_id', foreignField: '_id', as: 'book' } }, { $unwind: '$book' }, { $project: { count: 1, title: '$book.title' } } ] 
		const resAgg = await Loan.aggregate(pipeline) 
		res.json(resAgg.map(r => ({ title: r.title, count: r.count }))) 
	} catch (err) { 
		next(err) 
	} 
}

exports.trends = async (req, res, next) => { 
	try { 
		// simple monthly borrow counts for last 12 months 
		const now = new Date() 
		const months = [] 
		for (let i = 0; i < 12; i++) { 
			const d = new Date(now.getFullYear(), now.getMonth() - i, 1) 
			months.push({ year: d.getFullYear(), month: d.getMonth() + 1 }) 
		} 
		const start = new Date(now.getFullYear(), now.getMonth() - 11, 1) 
		const agg = await Loan.aggregate([ { $match: { issueDate: { $gte: start } } }, { $group: { _id: { year: { $year: '$issueDate' }, month: { $month: '$issueDate' } }, count: { $sum: 1 } } }, { $sort: { '_id.year': 1, '_id.month': 1 } } ]) 
		res.json({ months, data: agg }) 
	} catch (err) { 
		next(err) 
	} 
}