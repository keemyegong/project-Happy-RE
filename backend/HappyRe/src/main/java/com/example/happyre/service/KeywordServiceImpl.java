package com.example.happyre.service;

import com.example.happyre.dto.keyword.KeywordEntityDTO;
import com.example.happyre.entity.DiaryEntity;
import com.example.happyre.entity.KeywordEntity;
import com.example.happyre.entity.UserEntity;
import com.example.happyre.repository.KeywordRepository;
import com.example.happyre.repository.UserWordFrequencyRepository;
import io.jsonwebtoken.lang.Assert;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Transactional
@RequiredArgsConstructor
@Service
public class KeywordServiceImpl implements KeywordService {

    private final KeywordRepository keywordRepository;
    private final DiaryService diaryService;
    private final UserWordFrequencyRepository userWordFrequencyRepository;

    private static KeywordEntity getKeywordEntity(KeywordEntityDTO keywordEntityDTO, DiaryEntity diaryEntity) {
        KeywordEntity newOne = new KeywordEntity();
        newOne.setKeywordId(keywordEntityDTO.getKeywordId());
        newOne.setDiaryEntity(diaryEntity);
        newOne.setSequence(keywordEntityDTO.getSequence());
        newOne.setKeyword(keywordEntityDTO.getKeyword());
        newOne.setSummary(keywordEntityDTO.getSummary());
        newOne.setRussellX(keywordEntityDTO.getRussellX());
        newOne.setRussellY(keywordEntityDTO.getRussellY());
        newOne.setArchived(keywordEntityDTO.getArchived());
        return newOne;
    }

    @Override
    public KeywordEntity insert(KeywordEntity keywordEntity) {
        Assert.notNull(keywordEntity.getDiaryEntity(), "keywordEntity.diaryEntity must not be null");
        userWordFrequencyRepository.upsertFrequency(
                keywordEntity.getDiaryEntity().getUserEntity().getId(),
                keywordEntity.getKeyword(),
                1
                );

        return keywordRepository.save(keywordEntity);
    }

    @Override
    public KeywordEntity insertDTO(KeywordEntityDTO keywordEntityDTO) throws Exception {
        try {
            if (this.findById(keywordEntityDTO.getKeywordId()).get() != null)
                throw new Exception("Keyword already exists");
        } catch (NullPointerException e) {

        }
        if (keywordEntityDTO.getDiaryId() == null) throw new Exception("Keyword를 등록할 Diary의 Id가 존재하지 않음");
        DiaryEntity diaryEntity = diaryService.findById(keywordEntityDTO.getDiaryId()).get();
        if (diaryEntity == null) throw new Exception("Diary does not exist");
        KeywordEntity newOne = getKeywordEntity(keywordEntityDTO, diaryEntity);
        newOne.setKeywordId(null);//insert 할 것이기 때문에 null 처리.
        return this.insert(newOne);
    }


    @Override
    public List<KeywordEntity> insertDTOList(DiaryEntity diaryEntity, List<KeywordEntityDTO> keywordEntityDTOList) {
        return keywordEntityDTOList.stream().map(dto -> getKeywordEntity(dto, diaryEntity)).map(e -> this.insert(e)).toList();
    }

    @Override
    public Optional<KeywordEntity> findById(int keywordId) {
        return keywordRepository.findById(keywordId);
    }

    @Override
    public List<KeywordEntity> findByDiaryEntity(DiaryEntity diaryEntity) {
        return keywordRepository.findByDiaryEntity(diaryEntity);
    }

    @Override
    public List<KeywordEntity> findByKeywordAndUserEntity(String keyword, UserEntity userEntity) {
        return keywordRepository.findByKeywordAndUserEntity(keyword, userEntity);
    }

    @Override
    public List<KeywordEntity> findByArchivedAndUserEntity(Boolean isArchived, UserEntity userEntity) {
        return keywordRepository.findByArchivedAndUserEntity(isArchived, userEntity);
    }

    @Override
    public KeywordEntity update(KeywordEntity keywordDTOEntity) {
        KeywordEntity matchingEntity = keywordRepository.findById(keywordDTOEntity.getKeywordId()).orElseThrow();
        matchingEntity.setSequence(keywordDTOEntity.getSequence());
        matchingEntity.setSummary(keywordDTOEntity.getSummary());
        matchingEntity.setRussellX(keywordDTOEntity.getRussellX());
        matchingEntity.setRussellY(keywordDTOEntity.getRussellY());
        return keywordRepository.save(matchingEntity);
    }

    @Override
    public void delete(KeywordEntity keywordDTOEntity) {
        KeywordEntity matchingEntity = keywordRepository.findById(keywordDTOEntity.getKeywordId()).orElseThrow();
        keywordRepository.delete(matchingEntity);
    }

    @Override
    public void updateArchive(int keywordId, boolean archive) {
        Optional<KeywordEntity> keywordEntityOptional = keywordRepository.findById(keywordId);
        if (keywordEntityOptional.isPresent()) {
            KeywordEntity keywordEntity = keywordEntityOptional.get();
            keywordEntity.setArchived(archive);
            keywordRepository.save(keywordEntity);
        } else {
            throw new EntityNotFoundException("Keyword not found with id: " + keywordId);
        }

    }

    @Override
    public List<KeywordEntity> getMyKeywords(UserEntity userEntity) {
        List<DiaryEntity> diaryEntityList = diaryService.findByUserEntity(userEntity);
        List<KeywordEntity> keywordEntityList = keywordRepository.findByDiaryEntities(diaryEntityList);


        return keywordEntityList;
    }
}
