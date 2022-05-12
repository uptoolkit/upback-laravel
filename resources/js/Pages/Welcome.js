import React, {useEffect, useState} from 'react';
import {Link, Head} from '@inertiajs/inertia-react';
import {Button, Col, Form, Input, message, Modal, Row, Spin, Table} from "antd";

/**
 * Tutoriel Crud Table avec ANTD
 *
 * @param props
 * @return {JSX.Element}
 * @constructor
 */
export default function Welcome(props) {

    /**
     * UseState définit les attributs qui peuvent changer d'état
     */
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    /**
     * Un état peut être une variable qui a été updaté ou un état d'interface
     */
    const [onCreate, setOnCreate] = useState(false);
    const [onEdit, setOnEdit] = useState(false);

    /**
     * Form.useForm est un hook/helper de AntD permettant de gérer un formulaire simplement
     */
    const [createForm] = Form.useForm();
    const [editForm] = Form.useForm();

    /**
     * Définition d'une colonne
     *
     * @see : https://ant.design/components/form/
     */
    const [columns] = useState([
        {
            key: "id",
            title: "ID",
            dataIndex: "id",
        },
        {
            key: "name",
            title: "Name",
            dataIndex: "name",
        },
        {
            key: "email",
            title: "Email",
            dataIndex: "email",
        },
        {
            key: "action",
            title: "Actions",
            render: row => (
                <Button.Group>
                    <Button onClick={() => handleEdit(row)}>Edit</Button>
                    <Button onClick={() => handleDelete(row)}>Delete</Button>
                </Button.Group>
            )
        },
    ]);

    /**
     * UseEffect permet d'écouter des changements dans le composant
     *
     * /!\ pour écouter un changement au Mounted ou Unmounted, il faut mettre un [] en 2ème params
     */
    useEffect(() => {
        fetchData();
        return () => {
            console.log("Unmounted");
        }
    }, []);

    /**
     * Pour écouter uniquement une certaine variable => le mettre dans un tableau en 2ème variable
     */
    useEffect(() => {
        if (data) {
            console.log('Data updated');
        }
    }, [data])

    /**
     * Methode pour mettre à jour les données users (appelé au mounted et quand les données sont mis à jour)
     */
    const fetchData = () => {
        axios.get('api/users').then((res) => {
            setData(res.data.data.map((data) => {
                return {
                    ...data,
                    key: data.id
                };
            }));
        }).catch((err) => {
            message.error(err.message);
        }).finally(() => {
            setLoading(false);
        });
    }

    /**
     * Permet de fermer les modals et de mettre à jour le jeu de donnée
     */
    const handleClose = () => {
        setOnCreate(false);
        setOnEdit(false);
        fetchData();
    }

    /**
     * Met le status onCreate a true
     */
    const handleCreate = () => {
        setOnCreate(true);
    }

    /**
     * Met le status onEdit à true + assign les valeurs de la ligne au formulaire d'édition
     *
     * @param row
     */
    const handleEdit = (row) => {
        editForm.setFieldsValue(row);
        setOnEdit(true);
    }

    /**
     * Gère la suppression d'une ligne
     *
     * @param item
     */
    const handleDelete = (item) => {
        axios.delete('/api/users/' + item.id).then(() => {
            message.success('User deleted');
        }).catch(() => {
            message.error('Error user deleted');
        }).finally(() => {
            fetchData();
        });
    }

    /**
     * Gère la création d'un user en DB
     *
     * @param form
     */
    const handleCreateSubmit = (form) => {
        form
            .validateFields()
            .then((values) => {
                axios.post('/api/users', values).then((res) => {
                    message.success('User created');
                }).catch(() => {
                    message.error('Cannot create user');
                }).finally(() => {
                    handleClose();
                });
            })
            .catch((info) => {
                console.log('Validate Failed:', info);
            });
    }

    /**
     * Mets à jour un user en DB
     *
     * @param form
     */
    const handleEditSubmit = (form) => {
        form
            .validateFields()
            .then((values) => {
                axios.put('/api/users/' + values.id, values);
                message.success('User updated !');
            })
            .catch((info) => {
                message.error('Validate Failed:', info);
            }).finally(() => {
                handleClose();
            });
    }

    /**
     * Le return retourne l'html du composant au format JSX
     */
    return ( // La Convention veut qu'on mette un retour en parenthèse
        <> {/* En JSX on ne peut retourner qu'un element en retour => au minimum il faut l'entourer par un React.Fragment (balise html invisible) Voir : https://reactjs.org/docs/fragments.html */}
            <Head title="Welcome"/> {/* Permet d'injecter du code dans le Head voir : https://inertiajs.com/title-and-meta */}
            <div
                className="relative flex items-top justify-center bg-gray-100 dark:bg-gray-900 sm:items-center sm:pt-0">
                {/* Navigation par default de Laravel */}
                <div className="fixed top-0 right-0 px-6 py-4 sm:block">
                    {props.auth.user ? (
                        <Link href={route('dashboard')} className="text-sm text-gray-700 underline">
                            Dashboard
                        </Link>
                    ) : (
                        <>
                            <Link href={route('login')} className="text-sm text-gray-700 underline">
                                Log in
                            </Link>

                            <Link href={route('register')} className="ml-4 text-sm text-gray-700 underline">
                                Register
                            </Link>
                        </>
                    )}
                </div>

                {/* Table Crud ANTD */}
                <div className={"mt-20 m-4"}>
                    <Row className={'mt-13 mb-5'}>
                        <Col>
                            <Button onClick={handleCreate}>Create</Button>
                        </Col>
                    </Row>

                    <Spin spinning={loading}>
                        <Table
                            loading={loading}
                            columns={columns}
                            dataSource={data}
                        />
                    </Spin>

                    {/* Ajout de la modal createForm on ajoute un param forceRender quand il faut que le composant soit chargé au mounted (pour le form) */}
                    <Modal forceRender visible={onCreate} title={"Create user"}
                           onCancel={handleClose}
                           onOk={() => handleCreateSubmit(createForm)}>
                        <Form
                            form={createForm}
                            layout={'vertical'}
                            name="create"
                            autoComplete="off"
                        >
                            <Form.Item
                                label="Name"
                                name="name"
                                rules={[{required: true, message: 'Please input your name!'}]}
                            >
                                <Input/>
                            </Form.Item>
                            <Form.Item
                                label="Email"
                                name="email"
                                rules={[{required: true, message: 'Please input your email!'}]}
                            >
                                <Input/>
                            </Form.Item>
                            <Form.Item
                                label="Password"
                                name="password"
                                rules={[{required: true, message: 'Please input your password!'}]}
                            >
                                <Input.Password placeholder="input password"/>
                            </Form.Item>
                        </Form>
                    </Modal>

                    {/* Ajout de la modal editForm ici on doit rajouter un champs hidden ID pour la validation des data */}
                    <Modal forceRender visible={onEdit}
                           title={<>{"Edit user : " + editForm.getFieldValue('name')}</>}
                           onCancel={handleClose}
                           onOk={() => handleEditSubmit(editForm)}>
                        <Form
                            layout={'vertical'}
                            name="edit"
                            form={editForm}
                            autoComplete="off"
                        >
                            {/* Ajout de data en hidden, vous pouvez ajouter des règles de validation aussi voir : https://ant.design/components/form/#Form.Item */}
                            <Form.Item
                                label="Id"
                                name="id"
                                hidden={true}
                            >
                                <Input/>
                            </Form.Item>
                            <Form.Item
                                label="Name"
                                name="name"
                                rules={[{required: true, message: 'Please input your name!'}]}
                            >
                                <Input/>
                            </Form.Item>
                            <Form.Item
                                label="Email"
                                name="email"
                                rules={[{required: true, message: 'Please input your email!'}]}
                            >
                                <Input/>
                            </Form.Item>
                        </Form>
                    </Modal>
                </div>
            </div>
        </>
    );
}
