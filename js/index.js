const {fromEvent, of, iif, EMPTY} = rxjs;
const {ajax} = rxjs.ajax;
const {map, filter, debounceTime} = rxjs.operators;
const {mergeMap, switchMap} = rxjs.operators;

const inputEl = document.createElement('input');
document.body.appendChild(inputEl);

const ulEl = document.createElement('ul');
document.body.appendChild(ulEl);
ulEl.insertAdjacentHTML('beforeend', `<li>Type something to search...</li>`)

const inputElChange$ = fromEvent(inputEl, 'input');
const def$ = of([{name: 'Type something to search...'}]);
inputElChange$.pipe(
    map(o => o.target.value),
    debounceTime(100),
    switchMap(o =>
        iif(
            () => o.trim() !== '',
            of(o).pipe(
                map(o => new URLSearchParams({q: o})),
                switchMap(o => ajax.getJSON(`http://localhost:7070/api/search?${o}`))
            ),
            def$
        )
    ),
).subscribe({
    next: value => {
        ulEl.innerHTML = '';
        console.log('next', value);
        value.forEach(o => ulEl.insertAdjacentHTML('beforeend', `<li>${o.name}</li>`));
    },
    error: error => console.error('error', error),
    complete: () => console.info('complete'),
});
