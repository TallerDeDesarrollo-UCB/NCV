﻿using AutoMapper;
using NinosConValorAPI.Data.Entity;
using NinosConValorAPI.Data.Repository;
using NinosConValorAPI.Exceptions;
using NinosConValorAPI.Models;

namespace NinosConValorAPI.Services
{
    public class FixedAssetService : IFixedAssetService
    {
        private INCVRepository _NCVRepository;
        private IMapper _mapper;
        public FixedAssetService(INCVRepository fixedAssetRepository, IMapper mapper)
        {
            _NCVRepository = fixedAssetRepository;
            _mapper = mapper;
        }
        public async Task<FixedAssetModel> CreateFixedAssetAsync(FixedAssetModel fixedAsset)
        {
            var fixedAssetEntity = _mapper.Map<FixedAssetEntity>(fixedAsset);
            _NCVRepository.CreateFixedAsset(fixedAssetEntity);
            var result = await _NCVRepository.SaveChangesAsync();
            if (result)
            {
                return _mapper.Map<FixedAssetModel>(fixedAssetEntity);
            }
            throw new Exception("Error en la Base de Datos.");
        }

        public async Task<IEnumerable<FixedAssetModel>> GetFixedAssetsAsync()
        {
            var fixedAssetEntityList = await _NCVRepository.GetFixedAssetsAsync();
            return _mapper.Map<IEnumerable<FixedAssetModel>>(fixedAssetEntityList);
        }

        public async Task<FixedAssetModel> GetFixedAssetAsync(int fixedAssetId)
        {
            var fixedAsset = await _NCVRepository.GetFixedAssetAsync(fixedAssetId);

            if (fixedAsset == null)
                throw new NotFoundElementException($"El activo fijo con Id:{fixedAssetId} no existe.");

            return _mapper.Map<FixedAssetModel>(fixedAsset);
        }
    }
}
