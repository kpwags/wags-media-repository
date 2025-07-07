import express from 'express';

import { LinkRepository } from '@repositories/LinkRepository';
import { Link, LinkCategory } from '@models/link';

const linkRouter = express.Router();

linkRouter.get('/category', (_, res) => {
	LinkRepository.GetAllLinkCatgeories()
		.then(([error, data]) => {
			if (error) {
				return res.status(400).json({ error });
			}

			res.json(data);
		}).catch((e) => {
			return res.status(400).json({ error: e });
		});
});

linkRouter.get('/category/:id', (req, res) => {
	const id = parseInt(req.params.id);

	LinkRepository.GetLinkCategoryById(id)
		.then(([error, category]) => {
			if (error) {
				return res.status(400).json({ error });
			}

			if (!category) {
				res.status(404).json({ error: 'Link category not found' });
			} else {
				res.json(category);
			}
		}).catch((e) => {
			return res.status(400).json({ error: e });
		});
});

linkRouter.post('/category', (req, res) => {
	const { linkCategoryId, name, colorCode } = req.body;

	const category: LinkCategory = {
		linkCategoryId: parseInt(linkCategoryId),
		name,
		colorCode,
	};

	LinkRepository.AddLinkCategory(category)
		.then((error) => {
			if (error) {
				return res.status(400).json({ error });
			}

			res.send();
		}).catch((e) => {
			return res.status(400).json({ error: e });
		});
});

linkRouter.put('/category/:id', (req, res) => {
	const id = parseInt(req.params.id);

	const { name, colorCode } = req.body;

	const category: LinkCategory = {
		linkCategoryId: id,
		name,
		colorCode,
	};

	LinkRepository.UpdateLinkCategory(category)
		.then((error) => {
			if (error) {
				return res.status(400).json({ error });
			}

			res.send();
		}).catch((e) => {
			return res.status(400).json({ error: e });
		});
});

linkRouter.delete('/category/:id', (req, res) => {
	const id = parseInt(req.params.id);

	LinkRepository.DeleteLinkCategory(id)
		.then((error) => {
			if (error) {
				return res.status(400).json({ error });
			}

			res.send();
		})
		.catch((e) => {
			return res.status(400).json({ error: e });
		});
});

linkRouter.get('/reading-log/:id', (req, res) => {
	const id = parseInt(req.params.id);

	LinkRepository.GetLinksForReadingLogIssue(id)
		.then(([error, data]) => {
			if (error) {
				return res.status(400).json({ error });
			}

			res.json(data);
		}).catch((e) => {
			return res.status(400).json({ error: e });
		});
});

linkRouter.get('/limit/:count', (req, res) => {
	const count = parseInt(req.params.count);

	LinkRepository.GetAllLinks()
		.then(([error, data]) => {
			if (error) {
				return res.status(400).json({ error });
			}

			res.json(data.slice(0, count));
		}).catch((e) => {
			return res.status(400).json({ error: e });
		});
});

linkRouter.get('/', (_, res) => {
	LinkRepository.GetAllLinks()
		.then(([error, data]) => {
			if (error) {
				return res.status(400).json({ error });
			}

			res.json(data);
		}).catch((e) => {
			return res.status(400).json({ error: e });
		});
});

linkRouter.get('/:id', (req, res) => {
	const id = parseInt(req.params.id);

	LinkRepository.GetLinkById(id)
		.then(([error, podcast]) => {
			if (error) {
				return res.status(400).json({ error });
			}

			if (!podcast) {
				res.status(404).json({ error: 'Link not found' });
			} else {
				res.json(podcast);
			}
		}).catch((e) => {
			return res.status(400).json({ error: e });
		});
});

linkRouter.post('/', (req, res) => {
	const formBody = req.body;

	const link: Link = {
		linkId: 0,
		linkCategoryId: parseInt(formBody.linkCategoryId),
		linkTypeId: parseInt(formBody.linkTypeId),
		title: formBody.title,
		author: formBody.author,
		url: formBody.url,
		linkDate: formBody.linkDate,
		readingLogIssueNumber: formBody.readingLogIssueNumber,
	};

	LinkRepository.AddLink(link)
		.then((error) => {
			if (error) {
				return res.status(400).json({ error });
			}

			res.send();
		}).catch((e) => {
			return res.status(400).json({ error: e });
		});
});

linkRouter.put('/:id', (req, res) => {
	const id = parseInt(req.params.id);
	const formBody = req.body;

	const link: Link = {
		linkId: id,
		linkCategoryId: parseInt(formBody.linkCategoryId),
		linkTypeId: parseInt(formBody.linkTypeId),
		title: formBody.title,
		author: formBody.author,
		url: formBody.url,
		linkDate: formBody.linkDate,
		readingLogIssueNumber: formBody.readingLogIssueNumber,
	};

	LinkRepository.UpdateLink(link)
		.then((error) => {
			if (error) {
				return res.status(400).json({ error });
			}

			res.send();
		}).catch((e) => {
			return res.status(400).json({ error: e });
		});
});

linkRouter.delete('/:id', (req, res) => {
	const id = parseInt(req.params.id);

	LinkRepository.DeleteLink(id)
		.then((error) => {
			if (error) {
				return res.status(400).json({ error });
			}

			res.send();
		}).catch((e) => {
			return res.status(400).json({ error: e });
		});
});

export { linkRouter };