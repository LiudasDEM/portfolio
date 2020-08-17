import React, { useState, useEffect, useCallback, useRef } from 'react'
import { Fade, Container, Table, Button } from 'react-bootstrap'


import { useAlerts } from '../../contexts/Alerts'


import { http, getSearch, buildSearch } from '../../shared'


function UsersList() {
	const { showAlert } = useAlerts()
	const debounce = useRef({ firstFetch: true })

	const [users, setUsers] = useState([])
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
		window.history.replaceState(null, null, buildSearch(query))

		http.get(`/api/users${buildSearch(query)}`, { headers: { 'return-total-count': true } }).then(res => {
			setMaxPages(1 + Math.floor(Number(res.headers.get('total-count') || 0) / query.size))
			setUsers(res.data)
		}, showAlert)
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

	return <Fade in>
		<Container>
			<Table>
				<thead>
					<tr>
						<th>Email</th>
						<th>User group</th>
					</tr>
				</thead>
				<tbody>
					{users.map(user => <tr key={user._id}>
						<td>{user.email}</td>
						<td>{user.userGroup.title}</td>
					</tr>)}
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
		</Container>
	</Fade>
}


export default UsersList
