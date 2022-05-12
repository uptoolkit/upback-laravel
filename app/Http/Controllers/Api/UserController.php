<?php

namespace App\Http\Controllers\Api;

use Blok\Repository\AbstractEloquentRepository;
use Blok\Repository\Http\Controllers\AbstractApiController;
use Exception;
use Illuminate\Http\Request;

class UserController extends AbstractApiController
{
    /**
     * @var AbstractEloquentRepository
     */
    public $model;

    public function __construct(){
        parent::__construct();
        $this->app = app();
        $this->makeModel();
    }

    function model()
    {
        return \App\Repositories\UserRepository::class;
    }

    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     *
     * @return mixed
     * @throws Exception|\Exception
     */
    public function index(Request $request)
    {
        return $this->model->paginate(50, $request->toArray());
    }

    /**
     * Show the form settings
     *
     * @return \Illuminate\Http\Response
     */
    public function create(){
        return $this->model->getForm('create');
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param Request $request
     * @return mixed
     */
    public function store(Request $request)
    {
        return $this->model->create($request->all());
    }

    /**
     * Display the specified resource.
     *
     * @param $id
     *
     * @return \Illuminate\Database\Eloquent\Model
     */
    public function show($id)
    {
        return $this->model->find($id);
    }

    /**
     * Show the form info
     *
     * @param $id
     *
     * @return mixed
     */
    public function edit($id){
        return $this->model->getForm('edit', $id);
    }

    /**
     * Update the specified resource
     *
     * @param \Illuminate\Http\Request $request
     * @param $id
     *
     * @return \Illuminate\Http\JsonResponse|mixed
     */
    public function update($id, Request $request)
    {
        try {
            return $this->model->update($request->all(), $id);
        } catch (ValidationException $e) {
            return response()->json($e->errors(), 422);
        } catch (Exception $e) {
            return response()->json($e->getMessage(), 500);
        }
    }

    /**
     * Remove the specified resource
     *
     * @param $id
     * @return \Illuminate\Contracts\Routing\ResponseFactory|\Illuminate\Http\Response|mixed
     */
    public function destroy($id)
    {
        try {
            return $this->model->delete($id);
        } catch (Exception $e) {
            return response($e->getMessage(), 500);
        }
    }
}
