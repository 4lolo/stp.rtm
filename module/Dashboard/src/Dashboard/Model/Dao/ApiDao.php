<?php
namespace Dashboard\Model\Dao;

/**
 * Class EyeDao
 *
 * @package Dashboard\Model\Dao
 */
class ApiDao extends AbstractDao
{
    /**
     * Fetch all processes
     *
     * @param  array $params Params
     * @return array
     */
    public function fetchForGraphWidget(array $params = array())
    {
        return $this->request($this->getEndpointUrl(__FUNCTION__), $params);
    }
	
	public function fetchForStateWidget(array $params = array())
    {
        return $this->request($this->getEndpointUrl(__FUNCTION__), $params);
    }
}
