import AppBlocks from './blocks.module';
import template from './blocks.html';

const BlocksCtrlConstructor = function ($rootScope, $stateParams, $location, $http, blockTxs) {
	const vm = this;
	vm.getLastBlocks = (n) => {
		let offset = 0;

		if (n) {
			offset = (n - 1) * 20;
		}

		$http.get(`/api/getLastBlocks?n=${offset}`).then((resp) => {
			if (resp.data.success) {
				vm.blocks = resp.data.blocks;

				if (resp.data.pagination) {
					vm.pagination = resp.data.pagination;
				}
			} else {
				vm.blocks = [];
			}
		});
	};

	vm.getBlock = (blockId) => {
		$http.get('/api/getBlock', {
			params: {
				blockId,
			},
		}).then((resp) => {
			if (resp.data.success) {
				vm.block = resp.data.block;
			} else {
				throw new Error('Block was not found!');
			}
		}).catch(() => {
			$location.path('/');
		});
	};

	if ($stateParams.blockId) {
		vm.block = {
			id: $stateParams.blockId,
		};
		vm.getBlock($stateParams.blockId);
		vm.txs = blockTxs($stateParams.blockId);
	} else if ($stateParams.page) {
		vm.getLastBlocks($stateParams.page);
	} else {
		vm.getLastBlocks();
	}
};

AppBlocks.component('blocks', {
	template,
	controller: BlocksCtrlConstructor,
	controllerAs: 'vm',
});

