import express from 'express';

import linkRepository from './lib/LinkRepository';
import { Link, LinkCategory } from '../models/link';

const router = express.Router();

router.get('/category', (_, res) => {
    linkRepository.GetAllLinkCatgeories((error, data) => {
        if (error) {
            return res.status(400).json({ error });
        }

        res.json(data);
    });
});

router.get('/category/:id', (req, res) => {
    const id = parseInt(req.params.id);
    linkRepository.GetLinkCategoryById(id, (error, category) => {
        if (error) {
            return res.status(400).json({ error });
        }

        if (!category) {
            res.status(404).json({ error: 'Link category not found' });
        } else {
            res.json(category);
        }
    });
});

router.post('/category', (req, res) => {
    const { linkCategoryId, name, colorCode } = req.body;

    const category: LinkCategory = {
        linkCategoryId: parseInt(linkCategoryId),
        name,
        colorCode,
    };

    linkRepository.AddLinkCategory(category, (error) => {
        if (error) {
            return res.status(400).json({ error });
        }

        res.send();
    });
});

router.put('/category/:id', (req, res) => {
    const id = parseInt(req.params.id);

    const { name, colorCode } = req.body;

    const category: LinkCategory = {
        linkCategoryId: id,
        name,
        colorCode,
    };

    linkRepository.UpdateLinkCategory(category, (error) => {
        if (error) {
            return res.status(400).json({ error });
        }

        res.send();
    });
});

router.delete('/category/:id', (req, res) => {
    const id = parseInt(req.params.id);

    linkRepository.DeleteLinkCategory(id, (error) => {
        if (error) {
            return res.status(400).json({ error });
        }

        res.send();
    });

    res.send();
});

router.get('/reading-log/:id', (req, res) => {
    const id = parseInt(req.params.id);

    linkRepository.GetLinksForReadingLogIssue(id, (error, data) => {
        if (error) {
            return res.status(400).json({ error });
        }

        res.json(data);
    });
});

router.get('/limit/:count', (req, res) => {
    const count = parseInt(req.params.count);

    linkRepository.GetAllLinks((error, data) => {
        if (error) {
            return res.status(400).json({ error });
        }

        res.json(data.slice(0, count));
    });
});

router.get('/', (_, res) => {
    linkRepository.GetAllLinks((error, data) => {
        if (error) {
            return res.status(400).json({ error });
        }

        res.json(data);
    });
});

router.get('/:id', (req, res) => {
    const id = parseInt(req.params.id);
    linkRepository.GetLinkById(id, (error, podcast) => {
        if (error) {
            return res.status(400).json({ error });
        }

        if (!podcast) {
            res.status(404).json({ error: 'Link not found' });
        } else {
            res.json(podcast);
        }
    });
});

router.post('/', (req, res) => {
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

    linkRepository.AddLink(link, (error) => {
        if (error) {
            return res.status(400).json({ error });
        }

        res.send();
    });
    res.send();
});

router.put('/:id', (req, res) => {
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

    linkRepository.UpdateLink(link, (error) => {
        if (error) {
            return res.status(400).json({ error });
        }

        res.send();
    });
    res.send();
});

router.delete('/:id', (req, res) => {
    const id = parseInt(req.params.id);

    linkRepository.DeleteLink(id, (error) => {
        if (error) {
            return res.status(400).json({ error });
        }

        res.send();
    });

    res.send();
});

export default router;