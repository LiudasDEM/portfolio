import React, { useState, useEffect, useCallback, useRef } from 'react'
import PropTypes from 'prop-types'
import { Table, Button, Row, Col } from 'react-bootstrap'


import { http, getSearch, buildSearch } from '.'


// add sort
// add pages
//

function SuperTable({ endpoint, columns, ...props }) {
	const debounce = useRef({ firstFetch: true })
	const first = useRef(true)

	const [data, setData] = useState([])
	const [, setMaxPages] = useState(0)

	const [query, setQuery] = useState(() => {
		const search = getSearch()

		const q = {
			...search,
			page: (search.page | 0) || 0,
			size: (search.size | 0) || 10,
			search: search.search || undefined,
			sort: search.sort || undefined,
		}

		return q
	})

	const load = useCallback(function load() {
		props.bindFiltersToSearch && window.history.replaceState({}, '', window.location.origin + window.location.pathname + buildSearch(query))

		http.get(`${endpoint}${buildSearch(query)}`, { headers: { 'return-total-count': true } }).then(res => {
			setMaxPages(1 + Math.floor(Number(res.headers.get('total-count') || 0) / query.size))
			setData(res.data)
		}, props.onError || console.error)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [query])

	useEffect(() => {
		if (first.current) {
			first.current = false
			load()
			return
		}

		if (debounce.current) {
			clearTimeout(debounce.current)
		}

		debounce.current = setTimeout(() => { load() }, 100)

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
		<Row>
			<Col md={{ span: 4, offset: 8 }}>
				<span>Size </span>
				{[10, 30, 100].map(size => <Button
					disabled={query.size === size}
					key={size}
					variant="light"
					size="sm"
					onClick={() => setQuery(q => ({ ...q, size }))}>
					{size}
				</Button>)}
			</Col>
		</Row>
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


export default React.memo(SuperTable)
