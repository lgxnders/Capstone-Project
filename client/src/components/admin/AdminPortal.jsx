import { useState, useEffect } from 'react';
import { fetchAllResources, createResource, updateResource, deleteResource } from '../../services/api';

const AdminPortal = () => {
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingResource, setEditingResource] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        url: '',
        description: '',
        type: 'article',
        topics: '',
        tags: '',
        targetStates: '',
        timeEstimate: '',
        accessLevel: 'low',
        credibilityLevel: 'med'
    });

    useEffect(() => {
        loadResources();
    }, []);

    const loadResources = async () => {
        try {
            setLoading(true);
            const data = await fetchAllResources();
            setResources(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = {
                id: editingResource ? editingResource.id : crypto.randomUUID(),
                ...formData,
                title: formData.title.trim(),
                url: formData.url.trim(),
                description: formData.description.trim(),
                topics: formData.topics.split(',').map(t => t.trim()).filter(Boolean),
                tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
                targetStates: formData.targetStates.split(',').map(t => t.trim()).filter(Boolean),
                timeEstimate: formData.timeEstimate ? parseInt(formData.timeEstimate) : undefined,
                embedding: []
            };

            if (editingResource) {
                await updateResource(editingResource._id, data);
                setEditingResource(null);
            } else {
                await createResource(data);
            }

            setFormData({
                title: '',
                url: '',
                description: '',
                type: 'article',
                topics: '',
                tags: '',
                targetStates: '',
                timeEstimate: '',
                accessLevel: 'low',
                credibilityLevel: 'med'
            });
            loadResources();
        } catch (err) {
            setError(err.message);
        }
    };

    const handleEdit = (resource) => {
        setEditingResource(resource);
        setFormData({
            title: resource.title,
            url: resource.url,
            description: resource.description,
            type: resource.type,
            topics: resource.topics.join(', '),
            tags: resource.tags.join(', '),
            targetStates: resource.targetStates.join(', '),
            timeEstimate: resource.timeEstimate || '',
            accessLevel: resource.accessLevel,
            credibilityLevel: resource.credibilityLevel || 'med'
        });
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this resource?')) {
            try {
                await deleteResource(id);
                loadResources();
            } catch (err) {
                setError(err.message);
            }
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="admin-portal">
            <h2>Resource Management</h2>

            <div className="admin-panels">
                <div className="panel add-panel">
                    <h3>{editingResource ? 'Edit Resource' : 'Add New Resource'}</h3>
                    <form onSubmit={handleSubmit}>
                        <input
                            type="text"
                            name="title"
                            placeholder="Title"
                            value={formData.title}
                            onChange={handleInputChange}
                            required
                        />
                        <input
                            type="url"
                            name="url"
                            placeholder="URL"
                            value={formData.url}
                            onChange={handleInputChange}
                            required
                        />
                        <textarea
                            name="description"
                            placeholder="Description"
                            value={formData.description}
                            onChange={handleInputChange}
                            required
                        />
                        <select name="type" value={formData.type} onChange={handleInputChange}>
                            <option value="article">Article</option>
                            <option value="video">Video</option>
                            <option value="tool">Tool</option>
                            <option value="exercise">Exercise</option>
                            <option value="course">Course</option>
                            <option value="community">Community</option>
                        </select>
                        <input
                            type="text"
                            name="topics"
                            placeholder="Topics (comma separated)"
                            value={formData.topics}
                            onChange={handleInputChange}
                            required
                        />
                        <input
                            type="text"
                            name="tags"
                            placeholder="Tags (comma separated)"
                            value={formData.tags}
                            onChange={handleInputChange}
                            required
                        />
                        <input
                            type="text"
                            name="targetStates"
                            placeholder="Target States (comma separated)"
                            value={formData.targetStates}
                            onChange={handleInputChange}
                            required
                        />
                        <input
                            type="number"
                            name="timeEstimate"
                            placeholder="Time Estimate (minutes)"
                            value={formData.timeEstimate}
                            onChange={handleInputChange}
                        />
                        <select name="accessLevel" value={formData.accessLevel} onChange={handleInputChange}>
                            <option value="low">Low</option>
                            <option value="med">Medium</option>
                            <option value="high">High</option>
                        </select>
                        <select name="credibilityLevel" value={formData.credibilityLevel} onChange={handleInputChange}>
                            <option value="low">Low</option>
                            <option value="med">Medium</option>
                            <option value="high">High</option>
                        </select>
                        <button type="submit">{editingResource ? 'Update' : 'Add'} Resource</button>
                        {editingResource && <button type="button" onClick={() => {
                            setEditingResource(null);
                            setFormData({
                                title: '',
                                url: '',
                                description: '',
                                type: 'article',
                                topics: '',
                                tags: '',
                                targetStates: '',
                                timeEstimate: '',
                                accessLevel: 'low',
                                credibilityLevel: 'med'
                            });
                        }}>Cancel</button>}
                    </form>
                </div>

                <div className="panel list-panel">
                    <h3>Existing Resources</h3>
                    <div className="resource-list">
                        {resources.map(resource => (
                            <div key={resource._id} className="resource-item">
                                <h4>{resource.title}</h4>
                                <p>{resource.description}</p>
                                <p>Type: {resource.type}</p>
                                <div className="actions">
                                    <button onClick={() => handleEdit(resource)}>Edit</button>
                                    <button onClick={() => handleDelete(resource._id)}>Delete</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminPortal;