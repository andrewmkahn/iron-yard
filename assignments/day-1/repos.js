window.addEventListener('load', main);

function main() {
	const user = "mbostock";
	document.getElementById('repo_user').innerHTML = user;

	const warn = document.getElementById('warn');

	const token = "0769f07df1f34bacf719bd46c1ef19722c4c0d92";

	new Ajax(`https://api.github.com/users/${user}/repos?access_token=${token}`)
		.then(list_repos)
		.get();

	function list_repos(repos) {
		const repo_list = document.getElementById('repo_list');

		repos.forEach(function(repo) {
			const list_item = document.createElement('li');
			const link = document.createElement('a')
			link.href = repo.html_url;
			link.target= "_blank";
			link.innerHTML = repo.name;
			list_item.appendChild(link);
			repo_list.appendChild(list_item)
		});

		const search = document.getElementById('repo_search');
		search.addEventListener('keyup', function() {
			const term = this.value;
			const list_items = repo_list.getElementsByTagName('li');
			try {
				for (var item of list_items) {
					if (item.getElementsByTagName('a')[0].innerHTML.search(term) === -1) item.style.display = 'none';
					else item.style.display = 'list-item';
				}
				warn.style.display = 'none';
			}
			catch(e) {
				console.log(e);
				warn.style.display = 'block';
			}
		})
	}
}