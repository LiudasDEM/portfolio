import React, { useState, useEffect, useCallback, useRef } from 'react'
import PropTypes from 'prop-types'
import { Table, Button } from 'react-bootstrap'


import { http, getSearch, buildSearch } from '.'


function SuperTable({ endpoint, columns, ...props }) {
	const debounce = useRef({ firstFetch: true })

	const [data, setData] = useState([])
	const [, setMaxPages] = useState(0)

	const [query, setQuery] = useState(() => {
		const search = getSearch()

		const q = {
			...search,
			page: search.page || 0,
			size: search.size || 10,
			search: search.search || undefined,
			sort: search.sort || undefined,
		}

		return q
	})

	const load = useCallback(function load() {
		props.bindFiltersToSearch && window.history.replaceState(null, null, buildSearch(query))

		http.get(`${endpoint}${buildSearch(query)}`, { headers: { 'return-total-count': true } }).then(res => {
			setMaxPages(1 + Math.floor(Number(res.headers.get('total-count') || 0) / query.size))
			setData(res.data)
		}, props.onError || console.error)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [query])

	useEffect(() => {
		if (debounce.current) {
			if (debounce.current.firstFetch) {
				debounce.current = null
				load()
				return
			} else {
				clearTimeout(debounce.current)
			}
		}

		debounce.current = setTimeout(() => { load() }, 500)

		return () => clearTimeout(debounce.current)
	}, [load])

	return <>
		<Table>
			<thead>
				<tr>
					{columns.map(column => (
						<td key={column.title}>{column.title}</td>
					))}
				</tr>
			</thead>
			<tbody>
				{data.map(props.children)}
			</tbody>
		</Table>
		<div>
			{[10, 30, 100].map(size => <Button
				disabled={query.size === size}
				key={size}
				variant="light"
				onClick={() => setQuery(q => ({ ...q, size }))}>
				{size}
			</Button>)}
		</div>
	</>
}


SuperTable.propTypes = {
	children: PropTypes.func.isRequired,
	columns: PropTypes.arrayOf(PropTypes.shape({
		title: PropTypes.string.isRequired,
	})).isRequired,
	onError: PropTypes.func,
	endpoint: PropTypes.string.isRequired,
	bindFiltersToSearch: PropTypes.bool.isRequired,
}


export default SuperTable
