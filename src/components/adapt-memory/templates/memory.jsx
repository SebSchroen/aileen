import React, { useState, useEffect } from 'react';

import { classes, templates, compile } from 'core/js/reactHelpers';

export default function Memory(props) {
  const { _items, setActiveItem, resetActiveItems, setVisitedItems, _isComplete, feedback, status } = props;
  const [guesses, setGuesses] = useState([]);
  const [matched, setMatched] = useState([]);

  const handleClick = (match) => {
    if (matched.includes(match)) return;
    matched.length < 2 && setMatched((matched) => matched.concat(match));
  };
  useEffect(() => {
    if (!setActiveItem) return;
    if (matched.length === 0) return;

    if (matched.length === 1) {
      const itemIndex = parseInt(matched[0].split('|')[0]);
      setActiveItem(itemIndex);
    }
    if (matched.length === 2) {
      const itemIndex = parseInt(matched[1].split('|')[0]);
      setActiveItem(itemIndex);
      if (matched[0].split('|')[1] === matched[1].split('|')[1]) {
        setGuesses((guesses) => guesses.concat(matched));

        setVisitedItems([matched[0].split('|')[0], matched[1].split('|')[0]]);
      } else {
        setTimeout(() => {
          matched.forEach((match) => {
            const itemIndex = parseInt(match.split('|')[0]);
            const item = document.querySelector(`.js-memory-item[data-index="${itemIndex}"]`);
            item.classList.add('is-unmatched');
          });
        }, 50);
      }

      setTimeout(() => {
        const unmatchedItems = document.querySelectorAll('.js-memory-item.is-unmatched');
        unmatchedItems.forEach((item) => {
          item.classList.remove('is-unmatched');
        });
        setMatched([]);
        resetActiveItems();
      }, 1000);
    }
  }, [matched]);

  useEffect(() => {
    const visitedItems = _items.filter((item) => item._isVisited);
    const visitedItemsIndexes = visitedItems.map((item) => item._index);
    const visitedItemsTypes = visitedItems.map((item) => item.type);
    const visitedItemsMatches = visitedItemsIndexes.map((item, index) => `${item}|${visitedItemsTypes[index]}`);
    setGuesses(visitedItemsMatches);
  }, [_items]);
  return (
    <div className='component__inner memory__inner'>
      <templates.header {...props} />
      <div className='component__widget memory__widget'>
        <div className='memory__items'>
          {_items.map(({ _graphic, type, _classes, _index, _isVisited, _isActive }, index) => {
            return (
              <button
                onClick={() => handleClick(`${_index}|${type}`)}
                className={classes([
                  'memory-item',
                  'js-memory-item',
                  _graphic?.src && 'has-image',
                  _isActive && 'is-active is-locked',
                  _isVisited && 'is-visited is-disabled',
                  _classes
                ])}
                key={_index}
                data-index={_index}
                disabled={_isVisited || _isActive}
              >
                <span className='memory-item__btn-inner'>
                  <span className='memory-item__icon'>
                    <span className='icon' aria-hidden='true'></span>
                  </span>

                  <templates.image
                    {..._graphic}
                    classNamePrefixes={['component-item', 'memory-item']}
                    attributionClassNamePrefixes={['component', 'memory']}
                  />
                </span>
              </button>
            );
          })}
        </div>
      </div>
      <div className='component__footer memory__footer'>
        {!_isComplete && (
          <div className='memory__found'>
            <span
              className='memory__found-label'
              dangerouslySetInnerHTML={{
                __html: compile(status, { guesses: guesses.length / 2, total: _items.length / 2 })
              }}
            ></span>
          </div>
        )}
        {_isComplete && feedback && (
          <div className='memory__feedback'>
            <div className='memory__feedback-inner' dangerouslySetInnerHTML={{ __html: compile(feedback) }}></div>
          </div>
        )}
      </div>
    </div>
  );
}
