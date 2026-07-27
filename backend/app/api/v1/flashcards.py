from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.api.dependencies import get_db, get_current_user
from app.core.exceptions import NotFoundException
from app.models.all_models import User, FlashcardDeck, Flashcard
from app.schemas.schemas import ApiResponse, FlashcardMasteryUpdate

router = APIRouter(prefix="/flashcards", tags=["3D Spaced Repetition Flashcards"])

@router.get("", response_model=ApiResponse)
def list_flashcards(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    decks = db.query(FlashcardDeck).filter(FlashcardDeck.user_id == current_user.id).all()
    cards_out = []
    
    for d in decks:
        cards = db.query(Flashcard).filter(Flashcard.deck_id == d.id).all()
        for c in cards:
            cards_out.append({
                "id": c.id,
                "deck": d.name,
                "question": c.question,
                "answer": c.answer,
                "difficulty": c.difficulty,
                "mastered": c.mastered,
                "doc": c.doc
            })

    return ApiResponse(success=True, data=cards_out)

@router.patch("/{card_id}/mastery", response_model=ApiResponse)
def update_card_mastery(
    card_id: str,
    update_in: FlashcardMasteryUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    card = db.query(Flashcard).filter(Flashcard.id == card_id).first()
    if not card:
        raise NotFoundException("Flashcard not found")

    card.mastered = update_in.mastered
    db.commit()

    return ApiResponse(success=True, message="Flashcard mastery updated", data={"id": card.id, "mastered": card.mastered})
